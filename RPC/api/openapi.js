const fn  = require('../../_rpc_')

async function openapi(templateName='apidemo~openapi[post]/pet', opt={}) {
  const _rpc_ = fn()
  const {_lib_, _obj_} = _rpc_
  const mockserver = _obj_.argv.mockserver || 'http://127.0.0.1:4010'
  opt.api = 'mockserver'
  opt.act = templateName
  //'apidemo~openapi[get]/pet'.match(/(\w+)~(\w+)\[(\w+)\](\/.+)/)
  //['..', 'apidemo', 'openapi', 'get', '/pet',...]
  const match = templateName.match(/(\w+)~(\w+)\[(\w+)\](\/.+)/)
  if (!match) {
    const errmsg = {error: 'openapi mock is not there!'}
    console.error(errmsg)
    return errmsg
  }
  const [p0, nmspace, name, mth, epoint] = match
  let method = []
  if (_rpc_[nmspace]) {
    const apiname = _rpc_[nmspace]?._openapi_[name]
    if (apiname) {
      const endpoint = apiname[epoint]
      if (!endpoint) {
        const errmsg = {error: `no epoint of ${epoint}!, these are available: ${Object.keys(apiname)}`}
        console.error(errmsg)
        return errmsg
      }
      method = endpoint[mth]
      if (!method) {
        const errmsg = {error: `no ${epoint} of ${mth}!, these are available: ${Object.keys(endpoint)}`}
        console.error(errmsg)
        return errmsg
      }
    }
  }
  if (!method.length) {
    const errmsg = {
      error: 'no openapi mock!',
      syntax: `await RPC.api.fetch('apidemo~openapi[get]/pet')`
    }
    console.error(errmsg)
    return errmsg
  }
  const {schema, ...request} = method[0]
  const xhr = request
  if (schema) {
    xhr.body = _lib_.jsfaker(schema)
  }
  xhr.url = `${mockserver}${xhr.url.replace(/\{\w+\}/g, '123')}`
  return xhr
}
module.exports = openapi