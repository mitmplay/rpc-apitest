const ports = {
  '3002': `wss://${location.hostname}:3002/ws`,
  '3001':  `ws://${location.hostname}:3001/ws`,
  '5173':  `ws://${location.hostname}:3001/ws`
}

function initws() {
  const url = ports[location.port]
  const ws  = new WebSocket(url)
  // Pending requests in a Map
  ws.pendingRequests = new Map()
  return ws 
}
module.exports = initws
