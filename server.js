

// Express library
const express = require('express')
const cookieParser = require('cookie-parser')

const path = require('path')



// Environment vars
const result = require('dotenv').config()
if (result.error) {
  throw result.error
}
// const { PORT: PORTSTR, CLIENT_ID, CLIENT_SECRET, HOST_NAME } = result.parsed
const PORT = Number.parseInt(process.env.PORT, 10)

const DEVELOPMENT_ENV = process.env.NODE_ENV === 'development'


const BUILD_PATH = DEVELOPMENT_ENV
  ? '/client/dev_build'
  : '/client/build'
// console.log(BUILD_PATH)



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


const { setupAuth } = require('./authentication')

setupAuth({ app, PORT })


/**
 * TODO api endpoints
 */
app.get(['/api', '/api/*'], (req, res) => {
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

