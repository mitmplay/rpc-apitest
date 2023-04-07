const api     = require('./api')
const apidemo = require('./apidemo')
const process = require('./process')
const fn      = require('../_rpc_')

function RPC(_rpc_) {
  _rpc_ = fn({
    api,
    apidemo,
    process,
  })
}
module.exports = RPC
//https://www.jsonapi.co/public-api