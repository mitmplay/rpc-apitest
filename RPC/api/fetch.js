async function fetch(xhr, opt) {
  if (opt==='*') {
    opt = {}
  }
  if (typeof xhr==='string') {
    //'apidemo~openapi[get]/pet'.match(/(\w+)~(\w+)\[(\w+)\](\/.+)/)
    //['..', 'apidemo', 'openapi', 'get', '/pet',...]
    const [p0, nmspace, name, mth, epoint] = xhr.match(/(\w+)~(\w+)\[(\w+)\](\/.+)/)
    let method = []
    if (global.RPC[nmspace]) {
      const apiname = global.RPC[nmspace]?._request_[name]
      if (apiname) {
        const endpoint = apiname[epoint]
        if (endpoint) {
          method = endpoint[mth]
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
  }
  const result = await global.RPC._fn_.request(xhr, {
    api: 'fetch',
    act: 'act',
    ...opt,
  })
  return result
}
module.exports = fetch
