

import SpotifyWebApi from 'spotify-web-api-node'
import { Application } from 'express'
import { LocalsUserId, Res, setupPlaylistEndpoints } from './playlistEndpoints'
import {
  GetRefreshTokenResponse, GetTrackSearchResponse
} from '../client/src/shared/apiTypes'
import { accessTokenCache, refreshTokenCache } from './userCache'
import { spotifyApi } from './ownerAccount'



export const setupApi = (app: Application) => {
  
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
    
    // get saved user id, if it exists, from cache
    // getIdFromToken(undefined) would throw error, so we guard against it
    // userId == undefined if entry not found or if refresh_token cookie not set
    const userId = refresh_token && refreshTokenCache.getIdFromToken(refresh_token)
    
    if (!userId) {
      // no refresh token, or unrecognized refresh token
      res.sendStatus(401)
      return
    }
    const userAccountSpotifyApi = new SpotifyWebApi({
      refreshToken: refresh_token,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    })
    
    try {
      const data = await userAccountSpotifyApi.refreshAccessToken()
      
      // no need to clear old access token from cache because of TTL
      // map new access token to user id
      accessTokenCache.set(data.body.access_token, userId)
      
      res.cookie('access_token', data.body.access_token, { maxAge: data.body.expires_in * 1000 })
      res.json({ expires_in: data.body.expires_in } as GetRefreshTokenResponse)
      
    } catch (e) {
      console.error({e})
      res.sendStatus(502)
    }
    // no next()
  })
  
  
  /**
   * Ensure user is authenticated and load user data
   */
  app.use('/api/', (req, res: Res<LocalsUserId>, next) => {
    const { access_token } = req.cookies
    
    // NodeCache#get fails on undefined/null key
    res.locals.userId = access_token && accessTokenCache.get(access_token)
    
    if (!res.locals.userId) {
      // no access token or access token not in cache, user isn't authenticated
      res.sendStatus(401)
      return // no next()
    }
    next()
  })
  
  
  /**
   * set up endpoints that relate to playlists and interface with the db
   */
  setupPlaylistEndpoints(app)
  
  
  /**
   * Search for tracks by query
   * /api/search?q=query
   */
  app.get('/api/search', async (req, res) => {
    const { q } = req.query
    
    const data = await spotifyApi.searchTracks(q)
    
    res.json(data.body as GetTrackSearchResponse)
  })
  
  
  
  
  /**
   * Get user information from multiple ids
   * query param ids should be a comma separated list of ids
   * returns an object where the keys are the ids and the values are the user objects
   */
  app.get('/api/users/', async (req, res) => {
    const ids = (req.query.ids as string).split(',').filter(id => id !== '')
    
    // make all the requests:
    const requests = ids.map(id => spotifyApi.getUser(id))
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
  app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params
    
    const data = await spotifyApi.getUser(id)
    
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



