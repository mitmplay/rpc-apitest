function onmsgs(ws) {
  const {pendingRequests}= ws
  ws.onmessage = message => {
    const {data} = message
    const payload = JSON.parse(data)
    const {id, result, error, broadcast:method} = payload
    try {
      if (method) {
        const fnc = RPC._broadcast_[method.split(':')[0]]
        const any = RPC._broadcast_._any_
        let exany = true
        if (fnc) {
          console.log(`${method} RPC:`, payload)
          if (fnc(payload, method)===false) {
            exany = false
          }
        }
        if (exany) {
          let executed = 0
          for (const f in any) {
            if (any[f](payload, method)!==false) {
              executed++
            }
          }
          executed && console.log('any RPC:', payload)
        }
      } else {
        const { resolve, reject } = pendingRequests.get(id)
        pendingRequests.delete(id)
        error ? reject(error) : resolve(result)  
      }
    } catch (error) {
      console.error(`Error parsing WebSocket message: ${error}`)
    }
  }  
}
module.exports = onmsgs
