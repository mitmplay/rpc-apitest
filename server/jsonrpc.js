const {parse, success, error, JsonRpcError} = require('jsonrpc-lite')
const native = /\{\s*\[native code\]\s*\}/

module.exports = async _ => {
  const {_fn_: {_broadcast, _broadcast2}} = rpc()
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

  async function handleRequest(parsed, ws) {
    const {payload, broadcast, senderIp} = parsed
    const {_obj_} = rpc()
    let result
    try {
      result = await executeRpcMethod(payload, senderIp)
    } catch (error) {
      result = error 
    }
    const msg = `RPC ${payload.method}`
    if (_obj_.argv.verbose) {
      console.log(msg, '~>', result)
    } else if (_obj_.argv.devmode) {
      console.log(msg)
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
  return jsonrpc
}