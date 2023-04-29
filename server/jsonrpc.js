const {parse, success, error, JsonRpcError} = require('jsonrpc-lite')
const native = /\{\s*\[native code\]\s*\}/

module.exports = async _ => {
  async function executeRpcMethod({id, method, params}, senderIp) {
    const [k1, k2] = method.split('.')
    try {
      let result
      const fn = rpc()[k1][k2]
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
    const {_obj_} = rpc()
    if (broadcast) {
      let {method} = payload
      const peekcall = /\.(api_|fetch)/.test(method)
      if (peekcall) {
        result = success(result.id, await rpc().api.peek())
      }
      const rtn = {
        broadcast: peekcall ? `api.peek:${method}` : method,
        ...result
      }
      if (_obj_.argv.devmode) {
        console.log('_broadcast')
      }
      wss.clients.forEach(function each (client) {
        if (client.readyState === global.Websocket.OPEN) {
          client.send(JSON.stringify(rtn))
        }
      })
    }
  }

  async function _broadcast2(method, result) {
    const rtn = {
      broadcast: method,
      jsonrpc: "2.0",
      result
    }
    wss.clients.forEach(function each (client) {
      if (client.readyState === global.Websocket.OPEN) {
        client.send(JSON.stringify(rtn))
      }
    })
  }

  async function handleRequest(parsed, ws) {
    const {payload, broadcast, senderIp} = parsed
    const {_obj_} = rpc()
    let result
    try {
      result = await executeRpcMethod(payload, senderIp)
    } catch (error) {
      result = error 
    }
    if (_obj_.argv.verbose) {
      console.log('executeRpcMethod:', result)
    } else if (_obj_.argv.devmode) {
      console.log('executeRpcMethod!')
    }
    ws.send(JSON.stringify(result))
    const timeout = +(_obj_.argv.timeout || 100)
    setTimeout(()=>_broadcast(payload, broadcast, result), timeout)    
  }

  async function handleBatchRequest(parsed, ws) {
    const {payload, broadcast, senderIp} = parsed
    const {_obj_} = rpc()
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
    const timeout = +(_obj_.argv.timeout || 100)
    setTimeout(()=>_broadcast(requests, broadcast, results), timeout)
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
  const {_fn_} = rpc()
  _fn_._broadcast = _broadcast
  _fn_._broadcast2= _broadcast2
  return jsonrpc
}