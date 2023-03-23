const _request = require('request')

const req = function(request, opt={}) {
  return new Promise(resolve => {
    if (request.body && ['delete','get'].includes(request.method)) {
      delete request.body
    }
    const ts = Date.now()
    _request(request, (error, response) => {
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
          body = JSON.parse(body)
          resp = body
        } else {
          resp[`[${statusCode}]`] = 'No response payload!'
        }
        console.log(JSON.stringify(resp, null, 2))
        global.RPC._fn_.apilog(request, headers, resp, opt)
        resolve({
          request,
          response:{
            statusCode,
            headers,
            body,
          },
          error,
        })
      }
    })    
  })
}
module.exports = req