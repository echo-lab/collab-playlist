import { URLSearchParams } from "url"



import fetch from 'node-fetch'


export const setupAuth = ({app, PORT}) => {
  
  
  /**
   * Generates a random string containing numbers and letters
   * @param  {number} length The length of the string
   * @return {string} The generated string
   */
  const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    return new Array(length).fill(null).map(() =>
      possible.charAt(Math.floor(Math.random() * possible.length))
    ).join('')
  }
  
  const { HOST_NAME, CLIENT_ID, CLIENT_SECRET } = process.env

  const stateKey = 'spotify_auth_state'

  const redirect_uri = `${HOST_NAME}:${PORT}/auth/callback`
  
  const API_TARGET = process.env.API_TARGET || 'https://accounts.spotify.com'

  const authHeader = `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`

  /**
   * authorization endpoint. The user clicks on a link to get here, then gets
   * redirected to a spotify login page, which then redirects the user to
   * redirect_uri (/callback)
   */
  app.get('/auth', (req, res) => {
    const state = generateRandomString(16)
    res.cookie(stateKey, state) // store state in client for later
    
    const scope = 'user-read-private user-read-email' // like app permissions
    
    // the server requests authorization
    res.redirect(`${API_TARGET}/authorize?${
      new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope,
        redirect_uri,
        state, // spotify also gets the state, which will be compared to the cookie later
      })
    }`)
  })


  /**
   * the spotify authorization page redirects users to /callback with a code for
   * getting an access token. The server requests refresh and access tokens after
   * checking the state parameter
   */
  app.get('/auth/callback', async (req, res) => {
    const { code, state } = req.query // code and state that spotify gave
    const storedState = req.cookies[stateKey] // state in client's cookies
    
    if (!state || state !== storedState) {
      // either spotify didn't give a state or it wasn't equal to the client's state
      res.redirect(502, '/error/state_mismatch')
      return
    }
    res.clearCookie(stateKey)
    
    try {
      // get access_token and refresh_token from spotify
      const response = await fetch(`${API_TARGET}/api/token`, {
        method: 'POST',
        headers: { 'Authorization': authHeader },
        body: new URLSearchParams({
          code,
          redirect_uri, // is this needed?
          grant_type: 'authorization_code',
        }),
      })
      if (!response.ok) {
        throw `token status: ${response.status}`
      }
      
      const body = await response.json()
      const { access_token, refresh_token } = body
      console.log({ access_token, refresh_token })
      
      res.cookie('access_token', access_token, { maxAge: 15 * 60 * 1000 })
        .cookie('refresh_token', refresh_token, { maxAge: 24 * 60 * 60 * 1000 })
        .redirect('/')
      
    } catch (e) {
      // either there was an error with fetch (status 4xx/5xx?) or the status
      // was not OK (not 2xx)
      console.error(e)
      res.redirect(502, '/error/invalid_token')
    }
  })
  
  
  
}


// module.exports = {
//   setupAuth,
// }



