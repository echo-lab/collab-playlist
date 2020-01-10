
/**
 * This file redirects any requests for /api or /auth made in the frontend
 * served by npm start to the backend server, which should be also on localhost
 * but at BACKEND_PORT
 * 
 * This is needed instead of simply "proxy": "" in package.json to work on
 * not just the ajax fetches but also the actual redirects
 * 
 * It seems to work by putting this middleware before all other routes in npm
 * start's webpack dev server
 */

const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    ['/api', '/auth'],
    proxy({
      target: `http://localhost:${process.env.BACKEND_PORT}`,
      changeOrigin: true,
    })
  )
}


