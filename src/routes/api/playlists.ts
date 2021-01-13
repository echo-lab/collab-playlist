
import express from 'express'

import {
  SituatedChatEvent,
  TrackObject,
  SeparateChatMessage,
  SeparateChatAction,
  PlaylistDocument,
} from '../../../client/src/shared/dbTypes'
import {
  GetPlaylistIdResponse, PostSituatedChatRequest, PutTrackRemovedRequest,
  PostTrackRequest, PostSeparateChatRequest, GetPlaylistsResponse,
  PlaylistSimple
} from '../../../client/src/shared/apiTypes'
import { spotifyApi } from '../../ownerAccount'
import { playlistsDB, usersDB } from '../../db'



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
        images: spotifyPlaylist.images,
        name: spotifyPlaylist.name,
        owner: spotifyPlaylist.owner,
        followers: spotifyPlaylist.followers,
        tracks: res.locals.dbPlaylist.tracks
          .filter(dbTrack => !dbTrack.removed)
          .map(dbTrack => {
            const spotifyTrack = spotifyPlaylist.tracks.items
              .find(spotifyTrack => spotifyTrack.track.id === dbTrack.id)
              .track
            
            return {
              ...dbTrack,
              album: spotifyTrack.album,
              artists: spotifyTrack.artists,
              name: spotifyTrack.name,
            }
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
          {
            message,
            timestamp: new Date(),
            userId: res.locals.userId,
          } as SituatedChatEvent
        } }
      )
      
      res.status(201).json({})
    } catch (e) {
      next(e)
    }
  }
)

/**
 * Remove existing song in playlist
 * Removal is not a DELETE; it's gone from spotify, but our
 * backend remembers the chat history
 * Body should include a message, but it can be an empty string
 */
playlistIdRouter.put('/tracks/:trackId/removed',
  async (req, res: Res<LocalsDBPlaylist & LocalsUserId>, next) => {
    try {
      const { message } = req.body as PutTrackRemovedRequest
      const { playlistId, trackId } = req.params
      console.log({message, playlistId, trackId})
      
      await spotifyApi.removeTracksFromPlaylist(
        playlistId, [{ uri: `spotify:track:${trackId}` }]
      )
      
      const dbTrackIndex = res.locals.dbPlaylist.tracks.findIndex(
        track => track.id === trackId
      )
      await playlistsDB.update(
        { _id: playlistId },
        {
          $push: {
            [`tracks.${dbTrackIndex}.chat`]: {
              message,
              timestamp: new Date(),
              userId: res.locals.userId,
              action: 'remove',
            } as SituatedChatEvent,
            chat: {
              type: 'action',
              action: 'remove',
              trackId,
              timestamp: new Date(),
              userId: res.locals.userId,
            } as SeparateChatAction,
          },
          $set: {
            [`tracks.${dbTrackIndex}.removed`]: true
          }
        }
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
 */
playlistIdRouter.post('/tracks/',
  async (req, res: Res<LocalsUserId>, next) => {
    try {
      const { message, trackId } = req.body as PostTrackRequest
      const { playlistId } = req.params
      console.log({message, playlistId, trackId})
      
      await spotifyApi.addTracksToPlaylist(
        playlistId, [`spotify:track:${trackId}`]
      )
      
      await playlistsDB.update(
        { _id: playlistId },
        {
          $push: {
            tracks: {
              id: trackId,
              removed: false,
              addedBy: res.locals.userId,
              chat: [{
                message,
                timestamp: new Date(),
                userId: res.locals.userId,
                action: 'add',
              }]
            } as TrackObject,
            chat: {
              type: 'action',
              action: 'add',
              trackId,
              timestamp: new Date(),
              userId: res.locals.userId,
            } as SeparateChatAction
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
          {
            type: 'message',
            message,
            timestamp: new Date(),
            userId: res.locals.userId,
          } as SeparateChatMessage
        } }
      )
      
      res.status(201).json({})
    } catch (e) {
      next(e)
    }
  }
)




