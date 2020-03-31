
import { Application, Response } from 'express'
import SpotifyWebApi from 'spotify-web-api-node'




export interface ApiResponse extends Response {
  locals: {
    spotifyApi: SpotifyWebApi // will this need to be optional?
  }
}


export const setupUseApiWrapper = (app: Application) => {
  
  /**
   * sets up api wrapper for every api endpoint (other than refresh_token)
   * note: this middleware should be set up after the /api/refresh_token
   * endpoint
   * 
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
  
}


