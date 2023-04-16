const yargs   = require('yargs-parser')
const _home   = require('os').homedir()
const fn      = require('../../_rpc_')
const helper  = require('./helper')

module.exports = (_rpc_) => {
  const {_obj_} = _rpc_
  _obj_.argv = yargs(process.argv.slice(2))
  const argsChg= require('./args_chg')(_obj_)

  argsChg('d', 'devmode'   )
  argsChg('h', 'help'      )
  argsChg('m', 'mockserver')
  argsChg('o', 'open'      )
  argsChg('s', 'https'     )
  argsChg('t', 'test'      )
  argsChg('x', 'proxy'     )

  if (_obj_.argv.help) {
    helper(_rpc_)
  }

  if (_obj_.argv.devmode) {
    global.RPC = fn()
  }

  console.log(_obj_)
}
