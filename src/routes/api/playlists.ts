
import express from 'express'

import {
  SituatedChatEvent,
  TrackObject,
  SeparateChatMessage,
  SeparateChatAction,
  PlaylistDocument,
  RemovedTrackObject,
} from '../../../client/src/shared/dbTypes'
import {
  GetPlaylistIdResponse, PostSituatedChatRequest, PutTrackRemovedRequest,
  PostTrackRequest, PostSeparateChatRequest, GetPlaylistsResponse,
  PlaylistSimple,
  PlaylistTrackObject
} from '../../../client/src/shared/apiTypes'
import { spotifyApi } from '../../ownerAccount'
import { playlistsDB, usersDB } from '../../db'
import { asType } from '../../util'



/**
 * for type checking the res.locals object
 */
export interface Res<L> extends express.Response { locals: L }

/**
 * use these like: Res<LocalsUserId & LocalsDBPlaylist>
 */
export interface LocalsUserId { userId: string }
export interface LocalsDBPlaylist { dbPlaylist: PlaylistDocument }


/**
 * set up endpoints that relate to playlists and interface with the db
 */
export const playlistsRouter = express.Router()

/**
 * Get playlists that the user belongs to
 */
playlistsRouter.get('/', async (req, res: Res<LocalsUserId>, next) => {
  try {
    const user = await usersDB.findOne({ _id: res.locals.userId })
    const playlistIds = user?.playlists ?? []
    
    // get db and spotify playlist for each id, keeping them in order.
    // in-order Promise.all allows us to destructure [db, spotify] later
    const playlists = await Promise.all(playlistIds.map(id => 
      Promise.all([
        playlistsDB.findOne({ _id: id }),
        spotifyApi.getPlaylist(id).then(res => res.body)
      ])
    ))
    
    const response: GetPlaylistsResponse = playlists.map(
      ([dbPlaylist, spotifyPlaylist]): PlaylistSimple => ({
        id: dbPlaylist._id,
        users: dbPlaylist.users,
        name: spotifyPlaylist.name,
        // if multiple images present, image [1] has the closest resolution;
        // else use the only image
        image: (spotifyPlaylist.images[1] ?? spotifyPlaylist.images[0]).url,
      })
    )
    
    res.json(response)
  } catch (e) {
    next(e)
  }
})


// sub router for requests within a particular playlist; mergeParams forwards
// the playlistId param
const playlistIdRouter = express.Router({ mergeParams: true })

playlistsRouter.use('/:playlistId', playlistIdRouter)


/**
 * guard for /api/playlists/:id/*; check that playlist exists and user belongs
 * to playlist
 */
playlistIdRouter.use(
  async (req, res: Res<LocalsUserId & LocalsDBPlaylist>, next) => {
    const { playlistId } = req.params
    const dbPlaylist = await playlistsDB.findOne({ _id: playlistId })
    if (!dbPlaylist || !dbPlaylist.users.includes(res.locals.userId)) {
      // playlist not found in db or user doesn't belong, either way, doesn't
      // exist as far as the user is concerned
      return next({ status: 404 })
    }
    res.locals.dbPlaylist = dbPlaylist
    next()
  }
)


/**
 * Get this playlist
 */
playlistIdRouter.get('/',
  async (req, res: Res<LocalsDBPlaylist>, next) => {
    try {
      const { playlistId } = req.params
      
      // rejected if spotify playlist doesn't exist, -> 500
      const spotifyPlaylist = (await spotifyApi.getPlaylist(playlistId)).body
      
      // include spotify data that doesn't get saved to db, such as temporary
      // urls or names that can change
      const response: GetPlaylistIdResponse = {
        ...res.locals.dbPlaylist,
        // if multiple images present, i think image [1] has the closest resolution;
        // else use the only image
        image: (spotifyPlaylist.images[1] ?? spotifyPlaylist.images[0]).url,
        name: spotifyPlaylist.name,
        followers: spotifyPlaylist.followers.total,
        tracks: res.locals.dbPlaylist.tracks
          .map(dbTrack => {
            const spotifyTrack = spotifyPlaylist.tracks.items
              .find(spotifyTrack => spotifyTrack.track.id === dbTrack.id)
              .track
            
            return asType<PlaylistTrackObject>({
              ...dbTrack,
              album: spotifyTrack.album.name,
              artists: spotifyTrack.artists.map(artist => artist.name).join(', '),
              name: spotifyTrack.name,
            })
          })
      }
      
      res.json(response)
    } catch (e) {
      next(e)
    }
  }
)


/**
 * Post a message to a song's chat
 * body should have a message string property
 */
playlistIdRouter.post('/tracks/:trackId/chat/',
  async (req, res: Res<LocalsDBPlaylist & LocalsUserId>, next) => {
    try {
      const { message } = req.body as PostSituatedChatRequest
      const { playlistId, trackId } = req.params
      console.log({message, playlistId, trackId})
      
      const dbTrackIndex = res.locals.dbPlaylist.tracks.findIndex(
        track => track.id === trackId
      )
      await playlistsDB.update(
        { _id: playlistId },
        { $push: { [`tracks.${dbTrackIndex}.chat`]:
          asType<SituatedChatEvent>({
            action: 'comment',
            message,
            timestamp: new Date(),
            userId: res.locals.userId,
          })
        } }
      )
      
      res.status(201).json({})
    } catch (e) {
      next(e)
    }
  }
)

/**
 * Remove existing track in playlist or re-add after previously removing
 * Removal is not a DELETE; it's gone from spotify, but our
 * backend remembers the chat history
 * Body should include a message, but it can be an empty string
 * Body should include a boolean 'remove' that is true if the track is already
 *  present, or false if the track is already removed
 */
playlistIdRouter.put('/tracks/:trackId/removed',
  async (req, res: Res<LocalsDBPlaylist & LocalsUserId>, next) => {
    try {
      const { message, remove } = req.body as PutTrackRemovedRequest
      const { playlistId, trackId } = req.params
      console.log({message, remove, playlistId, trackId})
      
      // TODO illegal state checks? e.g. is track present in the correct list
      //  (removed vs not removed). also json body checks?
      
      // start fetching track now if removing
      let spotifyTrackPromise: Promise<SpotifyApi.SingleTrackResponse> | undefined
      if (remove) {
        // get spotify data needed to save a local copy of this track
        spotifyTrackPromise = spotifyApi.getTrack(trackId).then(res => res.body)
        
        await spotifyApi.removeTracksFromPlaylist(
          playlistId, [{ uri: `spotify:track:${trackId}` }]
        )
      } else {
        await spotifyApi.addTracksToPlaylist(
          playlistId, [`spotify:track:${trackId}`]
        )
      }
      
      
      // we are now going to mutate dbPlaylist and update the whole db document
      //  because nedb doesn't have support for the specific array operations we
      //  need (also js doesn't have great immutable array methods so we use
      //  mutation)
      
      const dbPlaylist = res.locals.dbPlaylist
      
      // list we're moving the track from
      const listFrom = remove ? dbPlaylist.tracks : dbPlaylist.removedTracks
      
      const dbTrackIndex = listFrom.findIndex(
        (track: TrackObject | RemovedTrackObject) => track.id === trackId
      )
      // TODO check track is present in listFrom
      
      // remove and get track object
      const [trackObject] = listFrom.splice(dbTrackIndex, 1)
      
      // add chat messages
      trackObject.chat.push(asType<SituatedChatEvent>({
        message,
        timestamp: new Date(),
        userId: res.locals.userId,
        action: remove ? 'remove' : 're-add',
      }))
      dbPlaylist.chat.push(asType<SeparateChatAction>({
        action: remove ? 'remove' : 're-add',
        timestamp: new Date(),
        userId: res.locals.userId,
        trackId: trackId,
      }))
      
      if (remove) {
        const spotifyTrack = await spotifyTrackPromise
        // convert track to removed track type
        const removedTrackObject: RemovedTrackObject = {
          id: trackObject.id,
          chat: trackObject.chat,
          removedBy: res.locals.userId,
          // cached spotify data
          album: spotifyTrack.album.name,
          artists: spotifyTrack.artists.map(artist => artist.name).join(', '),
          name: spotifyTrack.name,
        }
        // add removed track to start of "removed" list, will show up at the top
        //  of the removed section of the table on the frontend
        dbPlaylist.removedTracks.unshift(removedTrackObject)
      } else {
        // convert
        const newTrackObject: TrackObject = {
          id: trackObject.id,
          chat: trackObject.chat,
          addedBy: res.locals.userId,
        }
        // add track to end of list to reflect position in spotify playlist
        dbPlaylist.tracks.push(newTrackObject)
      }
      
      // replace the whole document with the new object; _id is unchanged
      await playlistsDB.update(
        { _id: playlistId },
        dbPlaylist
      )
      
      res.status(200).json({})
    } catch (e) {
      next(e)
    }
  }
)


/**
 * Add song to playlist
 * Body should include trackId
 * Body should include a message, but it can be an empty string
 * responds with error 422 if track already exists in `tracks` or
 *  `removedTracks`
 */
playlistIdRouter.post('/tracks/',
  async (req, res: Res<LocalsUserId & LocalsDBPlaylist>, next) => {
    try {
      const { message, trackId } = req.body as PostTrackRequest
      const { playlistId } = req.params
      console.log({message, playlistId, trackId})
      
      // check if track already exists
      if (
        (res.locals.dbPlaylist.tracks.find(track => track.id === trackId) !== undefined) ||
        (res.locals.dbPlaylist.removedTracks.find(track => track.id === trackId) !== undefined)
      ) {
        return next({ status: 422 })
      }
      
      await spotifyApi.addTracksToPlaylist(
        playlistId, [`spotify:track:${trackId}`]
      )
      
      await playlistsDB.update(
        { _id: playlistId },
        {
          $push: {
            tracks: asType<TrackObject>({
              id: trackId,
              addedBy: res.locals.userId,
              chat: [{
                message,
                timestamp: new Date(),
                userId: res.locals.userId,
                action: 'add',
              }]
            }),
            chat: asType<SeparateChatAction>({
              action: 'add',
              trackId,
              timestamp: new Date(),
              userId: res.locals.userId,
            })
          }
        }
      )
      
      res.status(201).json({})
    } catch (e) {
      next(e)
    }
  }
)


/**
 * Post a message to the playlist's (separate) chat
 * body should have a message string property
 */
playlistIdRouter.post('/chat/',
  async (req, res: Res<LocalsUserId>, next) => {
    try {
      const { message } = req.body as PostSeparateChatRequest
      const { playlistId } = req.params
      console.log({message, playlistId })
      
      
      await playlistsDB.update(
        { _id: playlistId },
        { $push: { chat:
          asType<SeparateChatMessage>({
            action: 'comment',
            message,
            timestamp: new Date(),
            userId: res.locals.userId,
          })
        } }
      )
      
      res.status(201).json({})
    } catch (e) {
      next(e)
    }
  }
)




