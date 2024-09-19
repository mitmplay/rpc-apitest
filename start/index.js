const _rpc_ = require('../_rpc_')()
const cli_args = require('./cli_args') 

function start() {
  global.RPC = _rpc_
  console.log('Init - Startup!')
  cli_args(_rpc_)

  const init_lib = require('./init_lib')
  const init_fnc = require('./init_fnc')
  
  init_lib(_rpc_)
  init_fnc(_rpc_)

  const chokidar = require('./chokidar')
  const fn = chokidar(_rpc_)
  return {_rpc_, fn}
}
module.exports = start
