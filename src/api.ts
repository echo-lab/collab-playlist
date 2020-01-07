

import SpotifyWebApi from 'spotify-web-api-node'


export const setupApi = ({ app }) => {
  
  
  /**
   * logs api requests
   */
  app.use('/api', (req, res, next) => {
    console.log(`${req.originalUrl} request`)
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
  app.get('/api/refresh_token/', async (req, res) => {
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
  
  
  /**
   * sets up api wrapper for every api endpoint other than refresh_token
   * @statusCode 401 not authenticated if no access token found, meaning
   * try refreshing access code through /api/refresh_token/
   */
  app.use('/api', (req, res, next) => {
    const { access_token } = req.cookies
    
    if (!access_token) {
      // no access token, so we can't make a request
      res.sendStatus(401)
      return // no next()
    }
    
    res.locals.spotifyApi = new SpotifyWebApi({
      accessToken: access_token
    })
    next()
  })
  
  
  /**
   * Search for tracks by query
   * /api/search/?q=query
   */
  app.get('/api/search/', async (req, res) => {
    const { q } = req.query
    
    const data = await res.locals.spotifyApi.searchTracks(q)
    
    res.json(data)
  })
  
  /**
   * catch all other api endpoints
   */
  app.get(['/api', '/api/*'], (req, res) => {
    console.log(`${req.path} not found`)
    res.sendStatus(404)
  })
}


// module.exports = {
//   setupApi,
// }

