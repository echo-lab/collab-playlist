

const SpotifyWebApi = require('spotify-web-api-node');


const setupApi = ({ app }) => {
  
  
  app.use('/api', (req, res, next) => {
    console.log(`${req.originalUrl} request`)
    next()
  })
  
  
  app.use('/api', (req, res, next) => {
    const { access_token, refresh_token } = req.cookies
    res.locals.api = new SpotifyWebApi({
      accessToken: access_token,
      refreshToken: refresh_token,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    })
    next()
  })
  
  
  app.get('/api/refresh_token', async (req, res) => {
    // client is requesting a new access_token using the refresh_token
    
    try {
      const data = await res.locals.api.refreshAccessToken()
      
      res.cookie('access_token', data.body.access_token, { maxAge: data.body.expires_in * 1000 })
        .json({ expires_in: data.body.expires_in })
      
    } catch (e) {
      console.error({e})
      res.sendStatus(502)
    }
  })
  
  
  /**
   * Search for tracks by query
   * /api/search/?q=query
   */
  app.get('/api/search/', async (req, res) => {
    const { q } = req.query
    
    const data = await res.locals.api.searchTracks(q)
    
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


module.exports = {
  setupApi,
}

