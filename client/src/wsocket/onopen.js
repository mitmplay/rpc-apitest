const rpc = require('jsonrpc-lite')
const log = require('./_log' )

// Helper function to generate unique request IDs
const t64 = 'Wabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZh'
const nanoid = (size = 8) => {
  let id = ''
  while (size-- > 0) {
    id += t64[Math.random() * 64 | 0]
  }
  return id
}

function onopen(ws) {
  const {pendingRequests}= ws
  // Helper function to send a JSON-RPC request over the WebSocket
  function sendRequest(method, params) {
    let id = nanoid()
    const arr = params.slice(-1)
    const req = rpc.request(id, method, params)
    if (/(^api\.|\.api_)/.test(method)) {
      if (arr[0]==='-') {
        params.pop()
      } else {
        req.broadcast = true // broadcast call
      }
    }
    if (RPC._obj_.argv.verbose?.includes('ws')) {
      console.warn('ws:send',req)
    }
    ws.send(JSON.stringify(req))
    return new Promise((resolve, reject) => {
      // Store the request ID and resolve/reject functions in the pending requests Map
      pendingRequests.set(id, { resolve, reject, method, params, logged: 0})
    })
  }
  window.sendRequest = sendRequest

  // Example usage with async/await and Promise.all()
  async function promiseAllClient() {
    //# client code
    try {
      const all = await Promise.all([
        sendRequest('apidemo.demo_add', [{ value: 1 }]),
        sendRequest('apidemo.demo_add', [{ value: 2 }]),
        sendRequest('apidemo.demo_add', [{ value: 3 }]),
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
    setTimeout(()=>{
      if (window.RPC._obj_?.argv?.devmode) {
        if (!window.RPC.apitest) {
          window.RPC.apitest = {}
        }
        window.RPC.apitest.promiseAllClient = promiseAllClient
        // for (const k1 in window.RPC) {
        //   if (!/^_.+_$/.test(k1)) {
        //     window.RPC[k1].log = log
        //   }
        // }  
      }  
    })
  }
}
module.exports = onopen
