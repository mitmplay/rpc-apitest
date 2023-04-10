const fn  = require('../../_rpc_')

async function mocks() {
  const _rpc_ = fn()
  const epmocks = []
  for (const app in _rpc_) {
    const _openapi_ = _rpc_[app]._openapi_ || {}
    for (const apiname in _openapi_) {
      const endpoints = _openapi_[apiname] || {}
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
