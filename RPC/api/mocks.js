async function mocks() {
  const epmocks = []
  for (const app in global.RPC) {
    const _request_ = global.RPC[app]._request_ || {}
    for (const apiname in _request_) {
      const endpoints = _request_[apiname] || {}
      for (const endpoint in endpoints) {
        const methods = endpoints[endpoint]
        for (const mth in methods) {
          epmocks.push(`await RPC.api.fetch('${app}~${apiname}[${mth}]${endpoint}')`)
        }
      }
    }
  }
  return JSON.stringify(epmocks.sort(), null, 2)
}
module.exports = mocks
