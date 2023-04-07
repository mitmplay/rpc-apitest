const fn  = require('../../_rpc_')

async function mocks() {
  const _rpc_ = fn()
  const epmocks = []
  for (const app in _rpc_) {
    const _request_ = _rpc_[app]._request_ || {}
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
