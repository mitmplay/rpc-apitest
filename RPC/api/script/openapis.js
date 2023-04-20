function iterate(fnc) {
  const _rpc_ = rpc()
  for (const app in _rpc_) {
    const _openapi_ = _rpc_[app]._openapi_ || {}
    for (const apiname in _openapi_) {
      const endpoints = _openapi_[apiname] || {}
      for (const endpoint in endpoints) {
        const methods = endpoints[endpoint]
        for (const mth in methods) {
          fnc(app, apiname, endpoint, mth, _rpc_)
        }
      }
    }
  }
}

async function openapis(plain=false) {
  if (plain) {
    let requests1 = {}
    iterate((app, apiname, endpoint, mth, _rpc_)=>{
      const path = `${apiname}${endpoint}/${mth}`
      const target = `${apiname}[${mth}]${endpoint}`
      const fnc = (paths, path) => paths[path]

      const json = {}
      json[path] = `${app}/${target}`
      if (!requests1[app]) {
        requests1[app] = {}
      }
      requests1[app] = _rpc_._fn_.merge(
        requests1[app],
        _rpc_._fn_.toTreeObj(app, json, fnc)
      )
    })
    return requests1
  } else {
    const requests2 = []
    iterate((app, apiname, endpoint, mth)=>{
      requests2.push(`await RPC.api.fetch('${app}/${apiname}[${mth}]${endpoint}')`)
    })
    return JSON.stringify(requests2.sort(), null, 2)
  }
}
module.exports = openapis
