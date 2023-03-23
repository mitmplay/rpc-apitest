const fs = require('fs-extra')
const {parse} = require('url')
const http = require('http')
const https = require('https')
const WebSocket = require('ws')
const website = require('./website')
const jsonrpc = require('./jsonrpc')

onconnect = ws => {
  console.log('Client connected')
  jsonrpc(ws)
}

function start() {
  const express = website()
  const path = `${global.__app}/cert/selfsigned`
  const server1 = http.createServer({}, express)
  const server2 = https.createServer({
    key:  fs.readFileSync(`${path}.key`, 'utf8'),
    cert: fs.readFileSync(`${path}.crt`, 'utf8'),
    rejectUnauthorized: false,
    agent: false,
  }, express)

  global.Websocket = WebSocket
  global.wss = new WebSocket.Server({ noServer: true })
  global.wss.on('connection', onconnect)
  
  function upgrade(request, socket, head) {
    const { pathname } = parse(request.url)

    if (pathname === '/ws') {
      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request)
      })
    } else {
      socket.destroy()
    }
  }

  server1.on('upgrade', upgrade)
  server2.on('upgrade', upgrade)

  console.log('MITM-RPC server started on port http:3001 & https:3002')
  server1.listen(3001)
  server2.listen(3002)
}
module.exports = start
