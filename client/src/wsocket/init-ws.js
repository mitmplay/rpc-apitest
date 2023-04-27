const ports = {
  '4002': `wss://${location.hostname}:4002/ws`,
  '4001':  `ws://${location.hostname}:4001/ws`,
  '5173':  `ws://${location.hostname}:4001/ws`
}

function initws() {
  const url = ports[location.port]
  const ws  = new WebSocket(url)
  // Pending requests in a Map
  ws.pendingRequests = new Map()
  return ws 
}
module.exports = initws
