

// Express library
const express = require('express')
const path = require('path')
// Environment vars
const result = require('dotenv').config()
if (result.error) {
	throw result.error
}
const { PORT: PORTSTR, CLIENT_ID, CLIENT_SECRET } = result.parsed
const PORT = Number.parseInt(PORTSTR, 10)


// join path helper
const fullPath = shortPath => path.join(__dirname, shortPath)


// create the server
const app = express()


/**
 * TODO api endpoints
 */
app.get('/api', (req, res) => {
	console.log('/api request')
	res.sendStatus(200)
})


/**
 * the single react app handles routing between pages, and the server serves
 * this app for all valid page urls
 */

app.get('/login', (req, res) => {
	console.log('get /login')
	res.sendFile(fullPath('/client/build/index.html'))
})


app.get('/', (req, res) => {
	console.log('get /')
	// console.log(req.query)
	const { access_token, refresh_token } = req.query
	if ( !access_token || !refresh_token ) {
		res.redirect('/login')
	} else {
		res.sendFile(fullPath('/client/build/index.html'))
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
app.use(express.static(fullPath('client/build')))


app.listen(PORT, () => {
	// on successful init
	console.log(`Collab-playlist server istening on port ${PORT}`)
})

