const api     = require('./api')
const fn      = require('../_rpc_')

function RPC(_rpc_) {
  const obj = {api}
  _rpc_ = fn(obj)
}
module.exports = RPC
