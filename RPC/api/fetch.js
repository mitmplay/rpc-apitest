const fn  = require('../../_rpc_')
const is_openapi = /~\w+\[\w+\]\//

async function fetch(xhr, opt) {
  const defOptions = {api: 'fetch', act: 'act'}
  const _rpc_ = fn()
  if (opt==='*') {
    opt = defOptions
  } else {
    opt = {
      ...defOptions,
      ...opt,
    }  
  }
  if (typeof xhr==='string') {
    if (is_openapi.test(xhr)) {
      xhr = await _rpc_.api.openapi(xhr, opt)
    } else {
      xhr = await _rpc_.api.request(xhr, opt)
    }
  }
  opt.senderIp = this.senderIp
  const result = await _rpc_._fn_.request(xhr, opt)
  return result
}
module.exports = fetch
