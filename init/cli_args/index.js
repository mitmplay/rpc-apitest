const yargs   = require('yargs-parser')
const _home   = require('os').homedir()
const fn      = require('../../_rpc_')
const helper  = require('./helper')
const {home}  = require('../init_fnc/tildehome')

module.exports = (_rpc_) => {
  const {_obj_} = _rpc_
  _obj_.argv = yargs(process.argv.slice(2))
  const argsChg= require('./args_chg')(_obj_)

  argsChg('d', 'devmode'   )
  argsChg('h', 'help'      )
  argsChg('j', 'json'      )
  argsChg('m', 'mockserver')
  argsChg('o', 'open'      )
  argsChg('s', 'https'     )
  argsChg('r', 'rpcpath'   )
  argsChg('t', 'test'      )
  argsChg('x', 'proxy'     )

  argsChg('D', 'debug'     )
  argsChg('T', 'timeout'   )
  argsChg('V', 'verbose'   )

  if (_obj_.argv.help) {
    helper(_rpc_)
  }

  if (_obj_.argv.devmode) {
    global.RPC = fn()
  }

  if (_obj_.argv.rpcpath) {
    const {argv} = _obj_
    argv.rpcpath = home(argv.rpcpath)
  }

  console.log(_obj_)
}
