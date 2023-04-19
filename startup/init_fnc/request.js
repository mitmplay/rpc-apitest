const _request = require('request')
const fn  = require('../../_rpc_')

const req = function(request, opt={}) {
  return new Promise(resolve => {
    if (request.body && ['delete','get'].includes(request.method)) {
      delete request.body
    } else if (typeof request.body!=='string') {
      request.body = JSON.stringify(request.body)
    }
    const ts = Date.now()
    _request(request, async (error, response) => {
      if (error) {
        resolve(error)
        console.error(error)
      } else {
        let {statusCode, headers, body} = response
        opt.rspcode = `${statusCode}`
        opt.created = ts
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
        resolve({
          request,
          response:{
            statusCode,
            headers,
            body,
          },
          error,
        })
        const {apilog, dnslookup} = fn()._fn_
        opt.dns = await dnslookup(opt.senderIp)
        const row = await apilog(request, headers, resp, opt)
        console.log(row)
      }
    })    
  })
}
module.exports = req