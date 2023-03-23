const path    = require('path')
const express = require('express')
const client  = require('./client')
const {static} = express
const app = express()

module.exports = () => {
  app.use('/js', static('./client/build'));
  app.get('/js/isomorphics.js', (req, res) => {
    res.send(client())
  })

  app.use('/assets', static('./svelte/dist/assets'));
  // app.use('/'   , static('./svelte/dist/index.html'));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../svelte/dist/index.html'));
    // res.send('Hi RPC Apitest!')
  })

  return app
}
