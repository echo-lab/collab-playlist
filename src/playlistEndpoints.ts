
// import SpotifyWebApi from 'spotify-web-api-node'
import { Application } from 'express'

import { ApiResponse } from './useApiWrapper'

import { createNedbPromisified } from './nedbPromisified'
import {
  PlaylistDocument,
  SituatedChatEvent,
  TrackObject,
  SeparateChatMessage,
  SeparateChatAction,
} from '../client/src/shared/dbTypes'
import { GetPlaylistIdResponse, PostSituatedChatRequest, PutTrackRemovedRequest, PostTrackRequest, PostSeparateChatRequest } from '../client/src/shared/apiTypes'



/**
 * set up endpoints that relate to playlists and interface with the db
 */
export const setupPlaylistEndpoints = (app: Application) => {
  
  const db = createNedbPromisified<PlaylistDocument>('db/playlists.0.db')
  
  
  /**
   * Get songs in this playlist
   */
  app.get('/api/playlists/:playlistId/', async (req, res: ApiResponse, next) => {
    try {
      const { playlistId } = req.params
      
      // start off the promise for the data:
      const spotifyPlaylistRequest = res.locals.spotifyApi.getPlaylist(playlistId)
      
      // while that's fetching, check if this playlist exists in the db at the
      // same time:
      const dbPlaylistPromise = db.findOne({ _id: playlistId })
      
      // doesn't matter which finishes first, they both happen at the same time
      // and we just wait for both to finish:
      const spotifyPlaylistResponse = await spotifyPlaylistRequest
      const dbPlaylist = await dbPlaylistPromise
      console.log({dbPlaylist})
      if (!dbPlaylist) {
        // playlist doesn't currently exist in db
        // keep track of playlist and its tracks, even though there's no messages
        // yet
        
        await db.insert({
          _id: playlistId,
          tracks: [],
          // tracks: spotifyPlaylist.body.tracks.items.map(item => ({
          //   id: item.track.id,
          //   chat: [],
          //   removed: false,
          // })),
          chat: [],
          chatMode: 'situated',
        })
      }
      // } else {
      
      // playlist already/now exists in db
      // its tracks could have been modified since the last time our backend
      // fetched the playlist from spotify (if a user modified the playlist
      // through the spotify app instead of our app)
      // so update the list of tracks
      // also, a track could be in the db but marked as removed, while it was
      // added back in on spotify, so also update the removed flag if necessary
      
      const dbTracks = dbPlaylist?.tracks ?? []
      
      spotifyPlaylistResponse.body.tracks.items.forEach(async spotifyItem => {
        const { id: trackId } = spotifyItem.track
        const findIndex = dbTracks.findIndex(
          dbTrack => dbTrack.id === trackId
        )
        const dbTrackFound = findIndex !== -1 ? dbTracks[findIndex] : null
        if (dbTrackFound) {
          // the track is in the db, so it's likely up to date
          // however if it's marked as removed in the db, that means it was
          // added back in on Spotify, so we need to reset removed
          if (dbTrackFound.removed) {
            await db.update(
              { _id: playlistId },
              { $set: { [`tracks.${findIndex}.removed`]: false }}
            )
          }
        } else {
          // the track isn't in the db, so add it
          await db.update(
            { _id: playlistId },
            { $push: { tracks: {
              id: trackId,
              chat: [],
              removed: false,
            }}}
          )
        }
      })
      // }
      
      const updatedDbPlaylist = await db.findOne({
        _id: playlistId
      })
      
      // const t: number = 'r';
      // res.json(spotifyPlaylist.body as GetPlaylistIdResponse)
      
      const response: GetPlaylistIdResponse = {
        ...spotifyPlaylistResponse.body,
        ...updatedDbPlaylist,
        tracks: spotifyPlaylistResponse.body.tracks.items.map((spotifyTrack, index) => ({
          ...spotifyTrack,
          ...updatedDbPlaylist.tracks.find(dbTrack => dbTrack.id === spotifyTrack.track.id),
        }))
        // spotifyPlaylist: spotifyPlaylist.body,
        // tracks: updatedDbPlaylist.tracks,
        // chat: updatedDbPlaylist.chat,
        // chatMode: updatedDbPlaylist.chatMode,
      }
      console.log({response})
      res.json(response)
    } catch (e) {
      next(e)
    }
  })
  
  
  /**
   * Post a message to a song's chat
   * body should have a message string property
   */
  app.post('/api/playlists/:playlistId/tracks/:trackId/chat/',
    async (req, res: ApiResponse, next) => {
      try {
        const { message } = req.body as PostSituatedChatRequest
        const { playlistId, trackId } = req.params
        console.log({message, playlistId, trackId})
        
        const dbPlaylist = await db.findOne({ _id: playlistId })
        const dbTrackIndex = dbPlaylist.tracks.findIndex(
          track => track.id === trackId
        )
        await db.update(
          { _id: playlistId },
          { $push: { [`tracks.${dbTrackIndex}.chat`]:
            {
              message,
              timestamp: new Date(),
              userId: (await res.locals.spotifyApi.getMe()).body.id,
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
  app.put('/api/playlists/:playlistId/tracks/:trackId/removed',
    async (req, res: ApiResponse, next) => {
      try {
        const { message } = req.body as PutTrackRemovedRequest
        const { playlistId, trackId } = req.params
        console.log({message, playlistId, trackId})
        
        await res.locals.spotifyApi.removeTracksFromPlaylist(
          playlistId, [{ uri: `spotify:track:${trackId}` }]
        )
        
        const dbPlaylist = await db.findOne({ _id: playlistId })
        const dbTrackIndex = dbPlaylist.tracks.findIndex(
          track => track.id === trackId
        )
        await db.update(
          { _id: playlistId },
          {
            $push: {
              [`tracks.${dbTrackIndex}.chat`]: {
                message,
                timestamp: new Date(),
                userId: (await res.locals.spotifyApi.getMe()).body.id,
                action: 'remove',
              } as SituatedChatEvent,
              chat: {
                type: 'action',
                action: 'remove',
                trackId,
                timestamp: new Date(),
                userId: (await res.locals.spotifyApi.getMe()).body.id,
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
  app.post('/api/playlists/:playlistId/tracks/',
    async (req, res: ApiResponse, next) => {
      try {
        const { message, trackId } = req.body as PostTrackRequest
        const { playlistId } = req.params
        console.log({message, playlistId, trackId})
        
        await res.locals.spotifyApi.addTracksToPlaylist(
          playlistId, [`spotify:track:${trackId}`]
        )
        
        await db.update(
          { _id: playlistId },
          {
            $push: {
              tracks: {
                id: trackId,
                removed: false,
                chat: [{
                  message,
                  timestamp: new Date(),
                  userId: (await res.locals.spotifyApi.getMe()).body.id,
                  action: 'add',
                }]
              } as TrackObject,
              chat: {
                type: 'action',
                action: 'add',
                trackId,
                timestamp: new Date(),
                userId: (await res.locals.spotifyApi.getMe()).body.id,
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
  app.post('/api/playlists/:playlistId/chat/',
    async (req, res: ApiResponse, next) => {
      try {
        const { message } = req.body as PostSeparateChatRequest
        const { playlistId } = req.params
        console.log({message, playlistId })
        
        
        await db.update(
          { _id: playlistId },
          { $push: { chat:
            {
              type: 'message',
              message,
              timestamp: new Date(),
              userId: (await res.locals.spotifyApi.getMe()).body.id,
            } as SeparateChatMessage
          } }
        )
        
        res.status(201).json({})
      } catch (e) {
        next(e)
      }
    }
  )
  
}



