async function fetch(xhr, opt) {
  const {_lib_, _obj_, _fn_} = global.RPC
  const mockserver = _obj_.argv.mockserver || 'http://127.0.0.1:4010'
  const defOptions = {api: 'fetch', act: 'act'}
  if (opt==='*') {
    opt = defOptions
  } else {
    opt = {
      ...defOptions,
      ...opt,
    }  
  }
  if (typeof xhr==='string') {
    opt.api = 'mockserver'
    opt.act = xhr
    //'apidemo~openapi[get]/pet'.match(/(\w+)~(\w+)\[(\w+)\](\/.+)/)
    //['..', 'apidemo', 'openapi', 'get', '/pet',...]
    const match = xhr.match(/(\w+)~(\w+)\[(\w+)\](\/.+)/)
    if (!match) {
      const errmsg = {error: 'openapi mock is not there!'}
      console.error(errmsg)
      return errmsg
    }
    const [p0, nmspace, name, mth, epoint] = match
    let method = []
    if (global.RPC[nmspace]) {
      const apiname = global.RPC[nmspace]?._request_[name]
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
    xhr = request
    if (schema) {
      xhr.body = _lib_.jsfaker(schema)
    }
    xhr.url = `${mockserver}${xhr.url.replace(/\{\w+\}/g, '123')}`
  }
  const result = await _fn_.request(xhr, opt)
  return result
}
module.exports = fetch
