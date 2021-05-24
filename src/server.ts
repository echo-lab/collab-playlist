

// Express library
import express, { Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'

import path from 'path'

import { accessTokenCache } from './userCache'



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
import { asType } from './util'
app.use('/admin', adminRouter)


app.post('/log', (req, res) => {
  const access_token = req.cookies.access_token
  // NodeCache#get fails on undefined/null key
  const userId = access_token && accessTokenCache.get(access_token)
  
  console.log(`CLIENT LOG: from id=${userId}; ${JSON.stringify(req.body)}`)
  res.sendStatus(200)
})



/**
 * the single react app handles routing between pages, and the server serves
 * this app for all valid page urls
 */

/**
 * frontend paths that aren't guarded behind login:
 */
app.get(['/login', '/error/*'], (req, res) => {
  console.log(`respond to ${req.originalUrl} with index.html`)
  res.sendFile(buildPath('index.html'))
})

/**
 * all other frontend paths require user to be logged in:
 */
app.get('/*', (req, res) => {
  const access_token = req.cookies.access_token
  
  // NodeCache#get fails on undefined/null key
  const userId = access_token && accessTokenCache.get(access_token)
  if (!userId) {
    res.redirect(303, '/login')
    return
  }
  
  console.log(`respond to ${req.originalUrl} with index.html`)
  res.sendFile(buildPath('index.html'))
})


/**
 * Error handler
 */
app.use(asType<express.ErrorRequestHandler>((err, req, res, next) => {
  console.error(`ERROR at ${req.method} ${req.originalUrl}:`)
  console.error(err)
  res.sendStatus(err.status ?? 500)
}))


app.listen(PORT, () => {
  // on successful init
  console.log(`Collab-playlist server listening on port ${PORT}`)
})

