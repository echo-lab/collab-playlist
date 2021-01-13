

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


/**
 * logs all requests other than static resources
 */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} request`)
  next()
})


// set up spotify api connection to owner account
import { refreshAccessToken } from './ownerAccount'
refreshAccessToken()

// set up authentication and api endpoints
import { authRouter } from './routes/auth'
app.use('/auth', authRouter)

import { apiRouter } from './routes/api'
app.use('/api', apiRouter)

import { adminRouter } from './routes/admin'
app.use('/admin', adminRouter)



/**
 * the single react app handles routing between pages, and the server serves
 * this app for all valid page urls
 */

app.get('/*', (req, res) => {
  console.log(`respond to ${req.originalUrl} with index.html`)
  res.sendFile(buildPath('index.html'))
})


/**
 * Error handler
 */
app.use(((err, req, res, next) => {
  console.error(`ERROR at ${req.method} ${req.originalUrl}:`)
  console.error(err)
  res.sendStatus(err.status ?? 500)
}) as express.ErrorRequestHandler)


app.listen(PORT, () => {
  // on successful init
  console.log(`Collab-playlist server listening on port ${PORT}`)
})

