

import { Application } from 'express'
import { playlistsDB, usersDB } from './db'
import { initializePlaylist } from './initializePlaylist'
import { spotifyApi } from './ownerAccount'
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
      const { byPlaylist, byUser } = await parseIdsCsv(process.env.DB_IDS)
      
      /**
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
       * TODO make the promises parallel
       */
      for (const config of byPlaylist) {
        const dbPlaylist = await playlistsDB.findOne({ _id: config.playlistId })
        if (dbPlaylist) {
          // playlistId found in db
          // TODO to do things with new/removed users, compare config.userIds to
          // dbPlaylist.users here
          await playlistsDB.update({ _id: config.playlistId }, {
            $set: {
              chatMode: config.chatMode,
              users: config.userIds,
            }
          })
        } else {
          // playlist must exist in spotify, otherwise there's an error
          await initializePlaylist(
            (await spotifyApi.getPlaylist(config.playlistId)).body,
            config
          )
          
          // for testing with fake playlist ids, replace above line with below:
          // await initializePlaylist({ tracks: { items: [
          //   { track: { id: 'mock track' }, added_by: { id: 'mock user' } }
          // ]}} as SpotifyApi.SinglePlaylistResponse, config)
        }
      }
      
      // fetch all users currently in db
      const users = await usersDB.find({})
      
      // a user can either be in the config but not the db, in the db but not
      // the config, or in both
      
      // for each user in the config, either set playlists or insert into db
      for (const [userId, playlists] of byUser) {
        // not using the upsert feature of nedb because i don't know how
        // reliable it is with promisify
        if (users.filter(user => user._id === userId).length) {
          // the user exists in the db
          await usersDB.update({ _id: userId }, { $set: { playlists } })
        } else {
          await usersDB.insert({ _id: userId, playlists })
        }
      }
      
      // we missed all the db users who aren't mentioned in the config
      for (const { _id: userId } of users) {
        // for all users, if they were not listed in the config then set
        // playlists to []
        if (!byUser.has(userId)) {
          await usersDB.update({ _id: userId }, { $set: { playlists: [] }})
        }
      }
      
      // manually stringify json to make spacing human readable
      res.type('application/json')
      res.send(JSON.stringify({byPlaylist, byUser: [...byUser]}, null, 2))
      
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


