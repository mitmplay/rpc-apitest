const init_lib  = require('./init_lib')
const init_fnc  = require('./init_fnc')
const cli_args  = require('./cli_args') 
const chokidar  = require('./chokidar')
const {
  name: _name_,
  version: _version_
} = require('../package.json')

const _db_     = {}
const _fn_     = {}
const _obj_    = {}
const _lib_    = {}
const apitest  = {}
const _watcher_= {}
global.RPC = {
  _db_,
  _fn_,
  _obj_,
  _lib_,
  _name_,
  apitest,
  _watcher_,
  _version_,
}

function init() {
  console.log('Init - Startup!')
  init_lib()
  cli_args()
  init_fnc()
  return chokidar()
}
module.exports = init
