

const SpotifyWebApi = require('spotify-web-api-node');


const setupApi = ({ app }) => {
  
  
  app.use('/api', (req, res, next) => {
    console.log(`${req.originalUrl} request`)
    next()
  })
  
  
  /**
   * Search for tracks by query
   * /api/search/?q=query
   */
  app.get('/api/search/', async (req, res) => {
    // console.log(req.query)
    
    const { q } = req.query
    const { access_token } = req.cookies
    
    const api = new SpotifyWebApi({
      accessToken: access_token
    })
    // console.log({api})
    const data = await api.searchTracks(q)
    // console.log({tracks: data.body.tracks})
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

