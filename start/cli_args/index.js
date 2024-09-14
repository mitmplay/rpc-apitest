const yargs   = require('yargs-parser')
const _home   = require('os').homedir()
const fn      = require('../../_rpc_')
const helper  = require('./helper')
const {home}  = require('../init_fnc/tildehome')

module.exports = (_rpc_) => {
  const {argv, env} = process;
  const {_obj_} = _rpc_
  _obj_.argv = yargs(argv.slice(2))
  env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  const argsChg= require('./args_chg')(_obj_)

  argsChg('d', 'devmode'   )
  argsChg('h', 'help'      )
  argsChg('j', 'json'      )
  argsChg('m', 'mockserver')
  argsChg('o', 'open'      )
  argsChg('r', 'rpcpath'   )
  argsChg('s', 'https'     )
  argsChg('t', 'test'      )
  argsChg('x', 'proxy'     )

  argsChg('D', 'debug'     )
  argsChg('T', 'timeout'   )
  argsChg('V', 'verbose'   )

  if (_obj_.argv.help) {
    helper(_rpc_)
  }

  if (_obj_.argv.devmode) {
    // global.RPC = fn()
  }

  if (_obj_.argv.rpcpath) {
    const {argv} = _obj_
    argv.rpcpath = home(argv.rpcpath)
  }

  if (typeof _obj_.argv.verbose==='string') {
    _obj_.argv.verbose = _obj_.argv.verbose.split(',')
  } else if (_obj_.argv.verbose) {
    _obj_.argv.verbose = []
  }

  console.log(_obj_)
}
