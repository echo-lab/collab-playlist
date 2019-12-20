

// Express library
const express = require('express')
const cookieParser = require('cookie-parser')

const path = require('path')
const fetch = require('node-fetch')


// Environment vars
const result = require('dotenv').config()
if (result.error) {
	throw result.error
}
const { PORT: PORTSTR, CLIENT_ID, CLIENT_SECRET, HOST_NAME } = result.parsed
const PORT = Number.parseInt(PORTSTR, 10)

const DEVELOPMENT_ENV = process.env.NODE_ENV === 'development'
// const PRODUCTION_ENV = !DEVELOPMENT_ENV //process.env.NODE_ENV === 'production'

console.log(process.env.NODE_ENV)
console.log(DEVELOPMENT_ENV)
const BUILD_PATH = DEVELOPMENT_ENV
	? '/client/dev_build'
	: '/client/build'
console.log(BUILD_PATH)

const API_TARGET = process.env.API_TARGET || 'https://accounts.spotify.com'

// join path helper
const fullPath = (...paths) => path.join(__dirname, ...paths)
const buildPath = (...paths) => fullPath(BUILD_PATH, ...paths)

// create the server
const app = express()

app.use(cookieParser())


/**
 * Serve all routes that exist in the react app's build
 * 
 * This will be triggered by files like *.json abd *.js
 * 
 * index: false makes it so this doesn't match the '/' route, which serves the app
 */
app.use(express.static(buildPath(), { index: false }))




// *** authorization code


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	return new Array(length).fill().map(() =>
		possible.charAt(Math.floor(Math.random() * possible.length))
	).join('')
}

const stateKey = 'spotify_auth_state'

const redirect_uri = `${HOST_NAME}:${PORT}/auth/callback`

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
	// const { query: { code, state }, cookies: { [stateKey]: storedState } } = req
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


app.get('/api/refresh_token', async (req, res) => {
	// client is requesting a new access_token using the refresh_token
	const { refresh_token } = req.cookies
	
	try {
		const response = await fetch(`${API_TARGET}/api/token`, {
			headers: { 'Authorization': authHeader },
			body: new URLSearchParams({
				grant_type: 'refresh_token',
				refresh_token,
			}),
		})
		if (!response.ok) {
			throw `token status: ${response.status}`
		}
		
		const body = await response.json()
		const { access_token } = body
		console.log({ access_token })
		
		res.cookie('access_token', access_token, { maxAge: 15 * 60 * 1000 })
		   .sendStatus(200)
		
	} catch (e) {
		// either there was an error with fetch (status 4xx/5xx?) or the status
		// was not OK (not 2xx)
		console.error(e)
		res.sendStatus(502)
	}
})


// *** </> auth code


/**
 * TODO api endpoints
 */
app.get('/api', (req, res) => {
	console.log('/api request')
	res.sendStatus(200)
})


app.get(['/sockjs-node', '/manifest.json'], (req, res) => {
	res.sendStatus(404)
})


/**
 * the single react app handles routing between pages, and the server serves
 * this app for all valid page urls
 */

app.get('/*', (req, res) => {
	console.log(`get ${req.url}`)
	res.sendFile(buildPath('index.html'))
})


app.listen(PORT, () => {
	// on successful init
	console.log(`Collab-playlist server istening on port ${PORT}`)
})

