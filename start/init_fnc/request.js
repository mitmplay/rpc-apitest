const _request = require('request')

const req = function(request, opt={}) {
  const {api, _fn_} = rpc()
  return new Promise(resolve => {
    if (request.body && ['delete','get'].includes(request.method)) {
      delete request.body
    } else if (typeof request.body!=='string') {
      request.body = JSON.stringify(request.body)
    }
    if (opt?.api?.proxy) {
      request.proxy = opt.api.proxy
    }
    const startTime = Date.now()
    _request(request, async (error, response) => {
      if (error) {
        resolve(error)
        console.error(error)
      } else {
        let {statusCode, headers, body} = response
        opt.rspcode = `${statusCode}`
        opt.created = startTime
        if (opt.x_tag) {
          const xtag= headers[opt.x_tag]
          xtag && (opt.x_tag = `${opt.x_tag}=${xtag}`)
        }
        global.data = body
        let resp = {}
        if (body) {
          const scode = Math.round(statusCode/100)
          if ([2,4].includes(scode)) {
            try {
              body = JSON.parse(body)              
            } catch (error) {
              // OK
            }
          }
          resp = body
        } else {
          resp[`[${statusCode}]`] = 'No response payload!'
        }
        console.log(JSON.stringify(resp, null, 2))
        const {apilog, hostlookup} = _fn_
        let ipAddress = opt?.senderIp || 'no-ip'
        try {
          ipAddress = ipAddress.replace(/^[:f]+/, '')
          opt.host = await hostlookup(ipAddress)          
        } catch (error) {
          opt.host = ipAddress
        }
        const [rowid] = await apilog(request, headers, resp, opt)
        console.log(rowid)
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        const result = {
          request,
          response:{
            statusCode,
            headers,
            body,
          },
          elapsedTime,
          rowid,
        }
        if (error) {
          result.error = error
        }
        resolve(result)
      }
    })    
  })
}
module.exports = req