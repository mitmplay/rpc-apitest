const rpc = require('jsonrpc-lite')
const log = require('./_log' )

// Helper function to generate unique request IDs
let requestId = 1
function generateRequestId() {
  return (requestId++) + ''
}

function onopen(ws) {
  const {pendingRequests}= ws
  // Helper function to send a JSON-RPC request over the WebSocket
  function sendRequest(method, params) {
    let id = generateRequestId()
    const arr = params.slice(-1)
    const req = rpc.request(id, method, params)
    if (/^(api|fetch$|peek$)/.test(method)) {
      if (arr[0]==='-') {
        params.pop()
      } else {
        req.broadcast = true // broadcast call
      }
    }
    ws.send(JSON.stringify(req))
    return new Promise((resolve, reject) => {
      // Store the request ID and resolve/reject functions in the pending requests Map
      pendingRequests.set(id, { resolve, reject })
    })
  }
  window.sendRequest = sendRequest

  // Example usage with async/await and Promise.all()
  async function addAll() {
    try {
      const all = await Promise.all([
        sendRequest('apidemo.add', [{ value: 1 }]),
        sendRequest('apidemo.add', [{ value: 2 }]),
        sendRequest('apidemo.add', [{ value: 3 }]),
      ])
      console.log(`Got data: ${JSON.stringify(all)}`)
      return all
    } catch (error) {
      console.error(`Error getting data:`, error)
      return error
    }
  }

  ws.onopen = async data => {
    console.log('Websocket open...')
    window.RPC.apitest.addAll = addAll
    for (const k1 in window.RPC) {
      if (!/^_.+_$/.test(k1)) {
        window.RPC[k1].log = log
      }
    }
  }
}
module.exports = onopen
