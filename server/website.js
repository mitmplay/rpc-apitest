const path    = require('path')
const express = require('express')
const client  = require('./client')
const handler = require('./svelte.js')
const app = express()

module.exports = () => {
  app.get('/js/isomorphics.js', (req, res) => {
    res.send(client())
  })

  app.use('/home', express.static('./html/index.html'));

  app.use('/js', express.static('./client/build'));
  // app.get('/', (req, res) => {
  //   res.sendFile(path.join(__dirname, '../html/index.html'));
  //   res.send('Hi RPC Apitest!')
  // })

  app.use(handler);

  return app
}
