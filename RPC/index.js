const api     = require('./api')
const apidemo = require('./apidemo')
const process = require('./process')
const fn      = require('../_rpc_')

function RPC(_rpc_) {
  const obj = {api}
  if (_rpc_._obj_.argv.devmode) {
    obj.apidemo = apidemo
    obj.process = process
  }
  _rpc_ = fn(obj)
}
module.exports = RPC
