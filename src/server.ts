

// Express library
import express, { Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'

import path from 'path'



// Environment vars
import { config } from 'dotenv'
const result = config()
if (result.error) {
  throw result.error
}
const PORT = Number.parseInt(process.env.PORT, 10)

// join path helper
// __dirname is in the build/src/ folder
// get path relative to project root:
const rootPath = (...paths) => path.join(__dirname, '../..', ...paths)
// get path relative to frontend build root
const buildPath = (...paths) => rootPath('/client/build', ...paths)

// create the server
const app = express()

app.use(cookieParser())
app.use(express.json())


/**
 * Serve all routes that exist in the react app's build. If a file is not found
 * this just calls the next() handler (instead of responding with an error)
 * 
 * This will be triggered by files like *.css and *.js
 * 
 * index: false makes it so this doesn't match the '/' route, which serves the app
 */
app.use(express.static(buildPath(), { index: false }))


// set up spotify api connection to owner account
import { refreshAccessToken } from './ownerAccount'
refreshAccessToken()

// set up authentication and api endpoints
import { authRouter } from './authentication'
app.use('/auth', authRouter)

import { apiRouter } from './api'
app.use('/api', apiRouter)

import { adminRouter } from './admin'
app.use('/admin', adminRouter)

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


/**
 * Error handler
 */
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`ERROR at ${req.method} ${req.originalUrl}: ${error}`)
  res.status(500).json({ error })
})


app.listen(PORT, () => {
  // on successful init
  console.log(`Collab-playlist server listening on port ${PORT}`)
})

