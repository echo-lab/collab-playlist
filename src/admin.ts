

import { Application } from 'express'
import { parseIdsCsv } from './parseIdsCsv'



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
   * endpoint for telling server to read ids.csv and update the DBs
   */
  app.post('/admin/load-ids', async (req, res) => {
    try {
      const configData = await parseIdsCsv(process.env.DB_IDS)
      
      // console.log({configData})
      
      /**
       * TODO
       * for each playlist in configData:
       * - if playlistId found in db:
       *   - set chatMode; all data inside is valid for all chatModes so it's not complicated
       *   - set users array in playlist, push playlist for each user
       *     - if user is new to playlist, do anything like a separate chat event?
       *     - if user is removed from playlist, do anything? TODO ask team what should be done in frontend
       *       - considering this bc of possible future features like listing names, color coding
       *       - activeUsers and archivedUsers arrays?
       * - else:
       *   - initializePlaylist
       *     - remove call from get playlist endpoint
       *     - in playlist endpoint, if dbPlaylist or spotifyPlaylist not found, error
       */
      
      res.send(JSON.stringify(configData, null, 2))
      
    } catch (e) {
      console.error(e)
      if (e.type === 'invalid chatMode') {
        res.status(400).send(e.error.message)
      } else if (e.code === 'ENOENT') {
        // don't naively send e.error.message, which has the full file path
        res.send(`File ${process.env.DB_IDS} not found`)
      } else {
        res.end()
      }
    }
  })
  
  
  
  /**
   * catch all other admin requests
   */
  app.all(['/admin', '/admin/*'], (req, res) => {
    console.log(`${req.path} not found`)
    res.sendStatus(404)
  })
  
  
}


