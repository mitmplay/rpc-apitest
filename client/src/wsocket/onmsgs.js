function onmsgs(ws) {
  const {pendingRequests}= ws
  ws.onmessage = async message => {
    const {data} = message
    const payload = JSON.parse(data)
    const {id, result, error, broadcast:method} = payload
    try {
      if (method) {
        const func = RPC._broadcast_[method.split(':')[0]]
        const fany = RPC._broadcast_._any_
        let exfunc = true
        let run 
        if (func) {
          console.log(`${method} RPC:`, payload)
          run = func(payload, method)
          if (run===false) {
            exfunc= false
          }
        }
        if (exfunc) {
          let t_executed = 0
          for (const f in fany) {
            run = fany[f](payload, method)
            if (run.then) {
              run = await run
            }
            if (run!==false) {
              t_executed++
            }
          }
          if (t_executed) {
            const {_obj_: {argv}} = RPC
            const json = {'RPC any-fn': method}
            if (argv.verbose) {
              json.result = result
            }
            console.log(json)
          }
        }
      }
      const pending = pendingRequests.get(id)
      if (pending) {
        pendingRequests.delete(id)
        const { resolve, reject } = pending
        error ? reject(error) : resolve(result)  
      }
    } catch (error) {
      console.error(`Error parsing WebSocket message: ${error}`)
    }
  }  
}
module.exports = onmsgs
