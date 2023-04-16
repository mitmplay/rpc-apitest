function onmsgs(ws) {
  const {pendingRequests}= ws
  ws.onmessage = message => {
    const {data} = message
    const payload = JSON.parse(data)
    const {id, result, error, broadcast} = payload
    try {
      if (broadcast) {
        const fnc = RPC._broadcast_[broadcast]
        const any = RPC._broadcast_._any_
        let exany = true
        if (fnc) {
          console.log(`${broadcast} RPC:`, payload)
          if (fnc(payload)===false) {
            exany = false
          }
        }
        if (exany) {
          let executed = 0
          for (const f in any) {
            if (any[f](payload)!==false) {
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
