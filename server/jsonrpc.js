const {parse, success, error, JsonRpcError} = require('jsonrpc-lite')
const native = /\{\s*\[native code\]\s*\}/

async function executeRpcMethod({id, method, params}) {
  const [k1, k2] = method.split('.')
  try {
    let result 
    const fn = global.RPC[k1][k2]
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

async function handleRequest(payload, ws) {
  let result = executeRpcMethod(payload)
  if (native.test('' + result.then)) {
    try {
      result = await result      
    } catch (error) {
      result = error 
    }
  }
  console.log('Result:', result)
  ws.send(JSON.stringify(result))
  if (payload.id.includes('*')) {
    const {method:broadcast} = payload
    if (broadcast!=='api_log.peek') {
      result = success(result.id, await RPC.api_log.peek())
    }
    const rtn = {broadcast, ...result}
    wss.clients.forEach(function each (client) {
      if (client.readyState === global.Websocket.OPEN) {
        client.send(JSON.stringify(rtn))
      }
    })
  }
}

async function handleBatchRequest(requests, ws) {
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
}

function jsonrpc(ws) {
  ws.on('message', async data => {
    const message = `${data}`
    const parsed = parse(message)
    if (parsed.type === 'request') {
      await handleRequest(parsed.payload, ws)
    } else if (parsed.type === 'batch') {
      await handleBatchRequest(parsed.payload, ws)
    }
  })
}

module.exports = jsonrpc
