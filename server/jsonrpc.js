const {parse, success, error, JsonRpcError} = require('jsonrpc-lite')
const native = /\{\s*\[native code\]\s*\}/

async function executeRpcMethod({id, method, params}, senderIp) {
  const [k1, k2] = method.split('.')
  try {
    let result 
    const fn = global.RPC[k1][k2]
    fn.senderIp = senderIp
    if (native.test('' + fn.then)) {
      result = await fn.apply(fn, params)
    } else {
      result = fn.apply(fn, params)
    }
    if (native.test('' + result.then)) {
      result = await result
    }
    return success(id, result)
  } catch (err) {
    console.error(err)
    const msg = `Method ${method}() not implemented`
    return error(id, new JsonRpcError(msg, id))  
  }
}

async function _broadcast(payload, broadcast, result) {
  if (broadcast) {
    const {method} = payload
    if (method!=='api.peek') {
      result = success(result.id, await RPC.api.peek())
    }
    const rtn = {
      broadcast: method,
      ...result
    }
    wss.clients.forEach(function each (client) {
      if (client.readyState === global.Websocket.OPEN) {
        client.send(JSON.stringify(rtn))
      }
    })
  }
}

async function handleRequest(parsed, ws) {
  const {payload, broadcast, senderIp} = parsed
  let result = executeRpcMethod(payload, senderIp)
  if (native.test('' + result.then)) {
    try {
      result = await result      
    } catch (error) {
      result = error 
    }
  }
  console.log('Result:', result)
  ws.send(JSON.stringify(result))
  _broadcast(payload, broadcast, result)
}

async function handleBatchRequest(parsed, ws) {
  const {payload, broadcast, senderIp} = parsed
  const results = requests.map(async ({ id, method, params }) => {
    let result = executeRpcMethod(payload)
    if (native.test('' + result.then)) {
      try {
        result = await result      
      } catch (error) {
        result = error 
      }
    } 
    return result
  })

  const response = stringify(results)
  ws.send(response)
  _broadcast(requests, broadcast, results)
}

function jsonrpc(ws) {
  ws.on('message', async data => {
    const message = `${data}`
    const parsed = parse(message)
    const senderIp = ws._socket.remoteAddress;
    parsed.senderIp = senderIp
    const {broadcast} = JSON.parse(message)
    if (broadcast) {
      parsed.broadcast = true
    }
    if (parsed.type === 'request') {
      await handleRequest(parsed, ws)
    } else if (parsed.type === 'batch') {
      await handleBatchRequest(parsed, ws)
    }
  })
}

module.exports = jsonrpc
