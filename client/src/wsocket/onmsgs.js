function onmsgs(ws) {
  const {pendingRequests}= ws
  ws.onmessage = async ({data}) => {
    const payload = JSON.parse(data)
    const {id, result, error, broadcast:method} = payload
    const pending = pendingRequests.get(id)
    const msg = {id}

    if (pending) {
      const {method: sd, params: pr} = pending
      if (pr?.length) {
        msg.sd = `${sd}('${pr[0]}',.)`
        if (RPC._obj_.argv.verbose && pr[1]) {
          msg.pr = pr[1]
        }
      } else {
        msg.sd = `${sd}(...)`
      }
    } else {
      msg.bc = method
    }
    if (RPC._obj_.argv.verbose) {
      msg.result = result
    }
    // const show = !(msg.bc && msg.id)
    try {
      if (method) {
        const typ  = method.split(':')[0]
        const fncs = RPC._broadcast_[typ]
        const fany = RPC._broadcast_._any_
        let exfunc = true
        let run 
        for (const f in fncs) {
          const func = fncs[f]
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
            msg.ex = true
          }
        }
      }
      if (RPC._obj_.argv.verbose?.includes('ws')) {
        console.warn('ws:rcvd',msg)
      }  
      // if (show) {
      //   console.warn(msg)
      // }
      if (pending) {
        pending.logged += 1
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
