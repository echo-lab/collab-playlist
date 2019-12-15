

// Express library
const express = require('express')

const path = require('path')
const fetch = require('fetch')

const querystring = require('querystring')


// Environment vars
const result = require('dotenv').config()
if (result.error) {
	throw result.error
}
const { PORT: PORTSTR, CLIENT_ID, CLIENT_SECRET, HOST_NAME } = result.parsed
const PORT = Number.parseInt(PORTSTR, 10)

const DEVELOPMENT_ENV = process.env.NODE_ENV === 'DEVELOPMENT'
// const PRODUCTION_ENV = !DEVELOPMENT_ENV //process.env.NODE_ENV === 'production'

console.log(process.env.NODE_ENV)
console.log(DEVELOPMENT_ENV)
const buildPath = DEVELOPMENT_ENV
	? '/client/dev_build'
	: '/client/build'
console.log(buildPath)

// join path helper
const fullPath = (...paths) => path.join(__dirname, ...paths)


// create the server
const app = express()


/**
 * TODO api endpoints
 */
app.get('/api', (req, res) => {
	console.log('/api request')
	res.sendStatus(200)
})



// *** authorization code


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  const text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	return new Array(length).fill().map(() =>
		possible.charAt(Math.floor(Math.random() * possible.length))
	)
}

const stateKey = 'spotify_auth_state'

const redirect_uri = `${HOST_NAME}/callback`

/**
 * authorization endpoint
 */
app.get('/auth', (req, res) => {
	const state = generateRandomString(16)
	res.cookie(stateKey, state) // store state in client for later
	
	const scope = 'user-read-private user-read-email' // like app permissions
	
	// the application requests authorization
  res.redirect(`https://accounts.spotify.com/authorize?${
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope,
      redirect_uri,
      state, // spotify also gets the state, which will be compared to the cookie later
		})
	}`)
})


// *** </> auth code


/**
 * the single react app handles routing between pages, and the server serves
 * this app for all valid page urls
 */

app.get('/login', (req, res) => {
	console.log('get /login')
	res.sendFile(fullPath(buildPath, 'index.html'))
})


app.get('/', (req, res) => {
	console.log('get /')
	// console.log(req.query)
	const { access_token, refresh_token } = req.query
	if ( !access_token || !refresh_token ) {
		res.redirect('/login')
	} else {
		res.sendFile(fullPath(buildPath, 'index.html'))
	}
})


/**
 * Serve all remaining routes if they exist in the react app's build
 * 
 * This will be triggered by files like *.css abd *.js
 * 
 * This goes after all other routes so that it doesn't override the '/' routes
 * which check for login state
 */
app.use(express.static(fullPath(buildPath)))


app.listen(PORT, () => {
	// on successful init
	console.log(`Collab-playlist server istening on port ${PORT}`)
})

