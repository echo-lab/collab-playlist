

import SpotifyWebApi from 'spotify-web-api-node'
import express from 'express'
import { LocalsUserId, Res, playlistsRouter } from './playlists'
import {
  GetRefreshTokenResponse, GetTrackSearchResponse, GetLoginResponse
} from '../../../client/src/shared/apiTypes'
import { accessTokenCache, refreshTokenCache } from '../../userCache'
import { spotifyApi } from '../../ownerAccount'



export const apiRouter = express.Router()


/**
 * client is requesting a new access_token using the refresh_token
 * @statusCode 401 not authenticated if no refresh token found, meaning
 * try authenticating again
 * @statusCode 502 bad gateway if spotify server error
 * @responseCookie access_token with new access_token with expiration
 * @responseBody json with expires_in in seconds for setting timeout
 */
apiRouter.get('/refresh_token', async (req, res, next) => {
  const { refresh_token } = req.cookies
  
  // get saved user id, if it exists, from cache
  // getIdFromToken(undefined) would throw error, so we guard against it
  // userId == undefined if entry not found or if refresh_token cookie not set
  const userId = refresh_token && refreshTokenCache.getIdFromToken(refresh_token)
  
  if (!userId) {
    // no refresh token, or unrecognized refresh token
    return next({ status: 401, cookie: req.headers.cookie })
  }
  const userAccountSpotifyApi = new SpotifyWebApi({
    refreshToken: refresh_token,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  })
  
  let data
  try {
    data = await userAccountSpotifyApi.refreshAccessToken()
  } catch (e) {
    return next({ err: e, status: 502, cookie: req.headers.cookie })
  }
  
  // no need to clear old access token from cache because of TTL
  // map new access token to user id
  accessTokenCache.set(data.body.access_token, userId)
  
  res.cookie('access_token', data.body.access_token, { maxAge: data.body.expires_in * 1000 })
  res.json({ expires_in: data.body.expires_in } as GetRefreshTokenResponse)
})


/**
 * Ensure user is authenticated and load user data
 */
apiRouter.use((req, res: Res<LocalsUserId>, next) => {
  const { access_token } = req.cookies
  
  // NodeCache#get fails on undefined/null key
  res.locals.userId = access_token && accessTokenCache.get(access_token)
  
  if (!res.locals.userId) {
    // no access token or access token not in cache, user isn't authenticated
    return next({ status: 401, cookie: req.headers.cookie })
  }
  next()
})


/**
 * Inform user they are logged in; responds 200 if logged in, 401 with empty
 * json body if not logged in
 */
apiRouter.get('/login', (req, res: Res<LocalsUserId>, next) => {
  res.json({ userId: res.locals.userId } as GetLoginResponse)
})


/**
 * set up endpoints that relate to playlists and interface with the db
 */
apiRouter.use('/playlists', playlistsRouter)


/**
 * Search for tracks by query
 * /api/search?q=query
 */
apiRouter.get('/search', async (req, res) => {
  const { q } = req.query
  
  const data = await spotifyApi.searchTracks(q)
  
  res.json(data.body as GetTrackSearchResponse)
})




/**
 * Get user information from multiple ids
 * query param ids should be a comma separated list of ids
 * returns an object where the keys are the ids and the values are the user objects
 */
apiRouter.get('/users/', async (req, res) => {
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
apiRouter.get('/users/:id', async (req, res) => {
  const { id } = req.params
  
  const data = await spotifyApi.getUser(id)
  
  res.json(data.body)
})


/**
 * catch server errors
 */
apiRouter.use(((err, req, res, next) => {
  console.error(`ERROR at ${req.method} ${req.originalUrl}:`)
  console.error(err)
  // always respond with json; never send err (might leak server info)
  res.status(err.status ?? 500)
     .json({}) // could use `err.client ?? {}`
}) as express.ErrorRequestHandler)


/**
 * catch all 404s in api path
 */
apiRouter.use((req, res) => {
  console.log(`${req.originalUrl} not found`)
  res.status(404).json({})
})



