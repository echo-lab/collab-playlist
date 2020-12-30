

// import { EROFS } from 'constants' // don't remember what this is for
import { Application } from 'express'
// import { readFile } from 'promise-fs'
// import { PlaylistDocument } from '../client/src/shared/dbTypes'
// import { db } from './db'



export const setupAdmin = (app: Application) => {
  
  /**
   * log admin requests
   */
  app.use('/admin/', (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} request`)
    next()
  })
  
  
  
  /**
   * ensure admin requests have admin key
   */
  app.use('/admin/', (req, res, next) => {
    if (req.cookies.admin_key !== process.env.ADMIN_KEY) {
      res.sendStatus(403)
      return
    }
    next()
  })
  
  
  /**
   * for testing curl, admin_key, etc
   */
  app.get('/admin/test', (req, res) => {
    res.sendStatus(200)
  })
  
  
  /**
   * catch all other admin requests
   */
  app.all(['/admin', '/admin/*'], (req, res) => {
    console.log(`${req.path} not found`)
    res.sendStatus(404)
  })
  
  
}


