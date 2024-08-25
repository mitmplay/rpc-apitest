const {success} = require('jsonrpc-lite')

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

module.exports = {
  _broadcast,
  _broadcast2
}