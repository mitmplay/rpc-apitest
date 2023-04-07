const init_lib  = require('./init_lib')
const init_fnc  = require('./init_fnc')
const cli_args  = require('./cli_args') 
const chokidar  = require('./chokidar')

function init() {
  const _rpc_ = require('../_rpc_')()
  console.log('Init - Startup!')
  init_lib(_rpc_)
  cli_args(_rpc_)
  init_fnc(_rpc_)
  const fn = chokidar(_rpc_)
  return {_rpc_, fn}
}
module.exports = init
