

// Express library
const express = require('express')

const path = require('path');


// join path helper
const fullPath = shortPath => path.join(__dirname, shortPath)


// create the server
const app = express()
// Serve the static files from the React app
app.use(express.static(fullPath('client/build')))


/**
 * TODO api endpoints
 */
// app.get('/api')


/**
 * handles any requests that don't match the ones above
 * this single react app handles routing between pages, and the server serves
 * this app for all page urls
 */
app.get('/*', (req, res) => {
	res.sendFile(fullPath('/client/build/index.html'))
})



app.listen(3000, () => {
	// on successful init
	console.log(`Collab-playlist server istening on port ${3000}`)
})

