const path    = require('path')
const express = require('express')
const client  = require('./client')
const {static} = express
const app = express()
const sv = '../svelte/dist'
module.exports = () => {
  app.use('/js', static(path.join(__dirname, '../client/build')))
  app.get('/js/isomorphics.js', (req, res) => {
    res.send(client())
  })

  app.use('/assets', static(path.join(__dirname, `${sv}/assets`)))

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, `${sv}/index.html`));
  })

  return app
}
