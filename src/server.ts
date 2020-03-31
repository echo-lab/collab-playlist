

// Express library
import express from 'express'
import cookieParser from 'cookie-parser'

import path from 'path'



// Environment vars
import { config } from 'dotenv'
const result = config()
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

// console.log({__dirname})
// console.log({port: process.env.PORT})

// join path helper
// __dirname is in the build/ folder
const rootPath = (...paths) => path.join(__dirname, '..', ...paths)
const buildPath = (...paths) => rootPath(BUILD_PATH, ...paths)

// create the server
const app = express()

app.use(cookieParser())
app.use(express.json())


/**
 * Serve all routes that exist in the react app's build
 * 
 * This will be triggered by files like *.json abd *.js
 * 
 * index: false makes it so this doesn't match the '/' route, which serves the app
 */
app.use(express.static(buildPath(), { index: false }))


// setup authentication and api endpoints
import { setupAuth } from './authentication'
setupAuth(app)

import { setupApi } from './api'
setupApi(app)

/**
 * The react app tries to get these but webpack doesn't create them for some reason
 * 
 * sockjs-node is probably related to hot reloading, but I thought I turned that off
 * 
 * I think manifest.json is a file that CRA created and that I deleted; I could bring it back
 */
app.get('/sockjs-node', (req, res) => {
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
  console.log(`Collab-playlist server listening on port ${PORT}`)
})

