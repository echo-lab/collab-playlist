
// import SpotifyWebApi from 'spotify-web-api-node'
import { Application } from 'express'

import { createNedbPromisified } from './nedbPromisified'
import {
  PlaylistDocument,
  SituatedChatEvent,
  TrackObject,
  SeparateChatMessage,
  SeparateChatAction,
} from '../client/src/shared/dbTypes'
import { GetPlaylistIdResponse, PostSituatedChatRequest, PutTrackRemovedRequest, PostTrackRequest, PostSeparateChatRequest } from '../client/src/shared/apiTypes'
import SpotifyWebApi from 'spotify-web-api-node'
import { spotifyApi } from './ownerAccount'
import { initializePlaylist } from './initializePlaylist'



/**
 * set up endpoints that relate to playlists and interface with the db
 */
export const setupPlaylistEndpoints = (app: Application) => {
  
  const db = createNedbPromisified<PlaylistDocument>(process.env.DB_PLAYLISTS)
  
  
  /**
   * Get songs in this playlist
   */
  app.get('/api/playlists/:playlistId/', async (req, res, next) => {
    try {
      const { playlistId } = req.params
      
      // fetch both database playlist record and spotify playlist
      let [
        dbPlaylist,
        { body: spotifyPlaylist },
      ] = await Promise.all([
        db.findOne({ _id: playlistId }),
        spotifyApi.getPlaylist(playlistId)
      ])
      
      if (!dbPlaylist) {
        // playlist not found in db
        dbPlaylist = await initializePlaylist(spotifyPlaylist, db)
      }
      
      // include spotify data that doesn't get saved to db, such as temporary
      // urls or names that can change
      const response: GetPlaylistIdResponse = {
        ...dbPlaylist,
        images: spotifyPlaylist.images,
        name: spotifyPlaylist.name,
        owner: spotifyPlaylist.owner,
        followers: spotifyPlaylist.followers,
        tracks: dbPlaylist.tracks
          .filter(dbTrack => !dbTrack.removed)
          .map(dbTrack => ({
            ...dbTrack,
            track: spotifyPlaylist.tracks.items
              .find(spotifyTrack => spotifyTrack.track.id === dbTrack.id)
              .track,
          }))
      }
      
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
    async (req, res, next) => {
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
  app.put('/api/playlists/:playlistId/tracks/:trackId/removed',
    async (req, res, next) => {
      try {
        const { message } = req.body as PutTrackRemovedRequest
        const { playlistId, trackId } = req.params
        console.log({message, playlistId, trackId})
        
        await spotifyApi.removeTracksFromPlaylist(
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
  app.post('/api/playlists/:playlistId/tracks/',
    async (req, res, next) => {
      try {
        const { message, trackId } = req.body as PostTrackRequest
        const { playlistId } = req.params
        console.log({message, playlistId, trackId})
        
        await spotifyApi.addTracksToPlaylist(
          playlistId, [`spotify:track:${trackId}`]
        )
        
        await db.update(
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
  app.post('/api/playlists/:playlistId/chat/',
    async (req, res, next) => {
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
  
}



