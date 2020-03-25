

import SpotifyWebApi from 'spotify-web-api-node'
import { Application, Response } from 'express'

import { createNedbPromisified } from './nedbPromisified'
import {
  PlaylistDocument,
  SituatedChatEvent,
  TrackObject,
  SeparateChatMessage,
  SeparateChatAction,
} from './dbTypes'


export const setupApi = (app: Application) => {
  
  const db = createNedbPromisified<PlaylistDocument>('db/playlists.0.db')
  
  
  /**
   * logs api requests
   */
  app.use('/api/', (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} request`)
    next()
  })
  
  
  
  /**
   * client is requesting a new access_token using the refresh_token
   * @statusCode 401 not authenticated if no refresh token found, meaning
   * try authenticating again
   * @statusCode 502 bad gateway if spotify server error
   * @responseCookie access_token with new access_token with expiration
   * @responseBody json with expires_in in seconds for setting timeout
   */
  app.get('/api/refresh_token', async (req, res) => {
    const { refresh_token } = req.cookies
    if (!refresh_token) {
      res.sendStatus(401)
      return
    }
    const spotifyApi = new SpotifyWebApi({
      refreshToken: refresh_token,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    })
    
    try {
      const data = await spotifyApi.refreshAccessToken()
      
      res.cookie('access_token', data.body.access_token, { maxAge: data.body.expires_in * 1000 })
      res.json({ expires_in: data.body.expires_in })
      
    } catch (e) {
      console.error({e})
      res.sendStatus(502)
    }
    // no next()
  })
  
  
  interface ApiResponseLocals {
    spotifyApi: SpotifyWebApi // will this need to be optional?
  }
  interface ApiResponse extends Response {
    locals: ApiResponseLocals
  }
  
  
  /**
   * sets up api wrapper for every api endpoint other than refresh_token
   * @statusCode 401 not authenticated if no access token found, meaning
   * try refreshing access code through /api/refresh_token
   */
  app.use('/api/', (req, res: ApiResponse, next) => {
    const { access_token } = req.cookies
    
    if (!access_token) {
      // no access token, so we can't make a request
      res.sendStatus(401)
      return // no next()
    }
    
    // might cause a problem if locals.spotifyApi is not optional
    res.locals.spotifyApi = new SpotifyWebApi({
      accessToken: access_token
    })
    next()
  })
  
  
  /**
   * Search for tracks by query
   * /api/search?q=query
   */
  app.get('/api/search', async (req, res: ApiResponse) => {
    const { q } = req.query
    
    const data = await res.locals.spotifyApi.searchTracks(q)
    
    res.json(data.body)
  })
  
  
  /**
   * Get user's collaborative playlists
   * /api/playlists/
   */
  app.get('/api/playlists/', async (req, res: ApiResponse) => {
    const data = await res.locals.spotifyApi.getUserPlaylists({
      limit: 50, // default 20
      // good to have as many as possible since we'll filter some/a lot out
    })
    // console.log({data})
    
    const collabPlaylists = data.body.items.filter(playlist => playlist.collaborative)
    
    res.json(collabPlaylists)
  })
  
  
  /**
   * Get songs in this playlist
   */
  app.get('/api/playlists/:playlistId/', async (req, res: ApiResponse) => {
    const { playlistId } = req.params
    
    // start off the promise for the data:
    const spotifyPlaylistRequest = res.locals.spotifyApi.getPlaylist(playlistId)
    
    // while that's fetching, check if this playlist exists in the db at the
    // same time:
    const dbPlaylistPromise = db.findOne({ _id: playlistId })
    
    // doesn't matter which finishes first, they both happen at the same time
    // and we just wait for both to finish:
    const spotifyPlaylist = await spotifyPlaylistRequest
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
    
    spotifyPlaylist.body.tracks.items.forEach(async spotifyItem => {
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
    
    res.json(spotifyPlaylist.body)
    
    // const response = {
    //   spotifyPlaylist: spotifyPlaylist.body,
    //   tracks: updatedDbPlaylist.tracks,
    //   chat: updatedDbPlaylist.chat,
    //   chatMode: updatedDbPlaylist.chatMode,
    // }
    // res.json(response)
  })
  
  
  /**
   * Post a message to a song's chat
   * body should have a message string property
   */
  app.post('/api/playlists/:playlistId/tracks/:trackId/chat/',
    async (req, res: ApiResponse) => {
      const { message } = req.body
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
    }
  )
  
  /**
   * Remove existing song in playlist
   * Removal is not a DELETE; it's gone from spotify, but our
   * backend remembers the chat history
   * Body should include a message, but it can be an empty string
   */
  app.put('/api/playlists/:playlistId/tracks/:trackId/removed',
    async (req, res: ApiResponse) => {
      const { message } = req.body
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
        { $push: { [`tracks.${dbTrackIndex}.chat`]:
          {
            message,
            timestamp: new Date(),
            userId: (await res.locals.spotifyApi.getMe()).body.id,
            action: 'remove',
          } as SituatedChatEvent
        } }
      )
      
      await db.update(
        { _id: playlistId },
        { $push: { chat:
          {
            type: 'action',
            action: 'remove',
            trackId,
            timestamp: new Date(),
            userId: (await res.locals.spotifyApi.getMe()).body.id,
          } as SeparateChatAction
        } }
      )
      
      res.status(200).json({})
    }
  )
  
  
  /**
   * Add song to playlist
   * Body should include trackId
   * Body should include a message, but it can be an empty string
   */
  app.post('/api/playlists/:playlistId/tracks/',
    async (req, res: ApiResponse) => {
      const { message, trackId } = req.body
      const { playlistId } = req.params
      console.log({message, playlistId, trackId})
      
      await res.locals.spotifyApi.addTracksToPlaylist(
        playlistId, [`spotify:track:${trackId}`]
      )
      
      await db.update(
        { _id: playlistId },
        { $push: { tracks:
          {
            id: trackId,
            removed: false,
            chat: [{
              message,
              timestamp: new Date(),
              userId: (await res.locals.spotifyApi.getMe()).body.id,
              action: 'add',
            }]
          } as TrackObject
        } }
      )
      
      await db.update(
        { _id: playlistId },
        { $push: { chat:
          {
            type: 'action',
            action: 'add',
            trackId,
            timestamp: new Date(),
            userId: (await res.locals.spotifyApi.getMe()).body.id,
          } as SeparateChatAction
        } }
      )
      
      res.status(201).json({})
    }
  )
  
  
  /**
   * Post a message to the playlist's (separate) chat
   * body should have a message string property
   */
  app.post('/api/playlists/:playlistId/chat/',
    async (req, res: ApiResponse) => {
      const { message } = req.body
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
    }
  )
  
  
  /**
   * Get user information from multiple ids
   * query param ids should be a comma separated list of ids
   * returns an object where the keys are the ids and the values are the user objects
   */
  app.get('/api/users/', async (req, res: ApiResponse) => {
    const ids = (req.query.ids as string).split(',')
    
    // make all the requests:
    const requests = ids.map(id => res.locals.spotifyApi.getUser(id))
    const responses = await Promise.all(requests)
    const bodies = responses.map(response => response.body)
    
    // since ids and bodies still have the same order, we can zip them together into an object
    const usersObj = Object.assign(
      { },
      ...ids.map((id, index) => ({ [id]: bodies[index] }))
    )
    
    res.json(usersObj)
  })
  
  /**
   * Get user information from id
   */
  app.get('/api/users/:id', async (req, res: ApiResponse) => {
    const { id } = req.params
    
    const data = await res.locals.spotifyApi.getUser(id)
    
    res.json(data.body)
  })
  
  
  /**
   * catch all other api endpoints
   */
  app.all(['/api', '/api/*'], (req, res) => {
    console.log(`${req.path} not found`)
    res.sendStatus(404)
  })
}



