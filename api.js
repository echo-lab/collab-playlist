

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
    // const { refresh_token } = req.cookies
    
    try {
      const access_token = await res.locals.api.refreshAccessToken()
      
      res.cookie('access_token', access_token, { maxAge: 15 * 60 * 1000 })
        .sendStatus(200)
    } catch (e) {
      console.error({e})
      res.sendStatus(502)
    }
    
  //   try {
  //     const response = await fetch(`${API_TARGET}/api/token`, {
  //       headers: { 'Authorization': authHeader },
  //       body: new URLSearchParams({
  //         grant_type: 'refresh_token',
  //         refresh_token,
  //       }),
  //     })
  //     if (!response.ok) {
  //       throw `token status: ${response.status}`
  //     }
      
  //     const body = await response.json()
  //     const { access_token } = body
  //     console.log({ access_token })
      
  //     res.cookie('access_token', access_token, { maxAge: 15 * 60 * 1000 })
  //       .sendStatus(200)
      
  //   } catch (e) {
  //     // either there was an error with fetch (status 4xx/5xx?) or the status
  //     // was not OK (not 2xx)
  //     console.error(e)
  //     res.sendStatus(502)
  //   }
  })
  
  
  /**
   * Search for tracks by query
   * /api/search/?q=query
   */
  app.get('/api/search/', async (req, res) => {
    // console.log(req.query)
    
    const { q } = req.query
    // const { access_token } = req.cookies
    
    // const api = new SpotifyWebApi({
    //   accessToken: access_token
    // })
    
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

