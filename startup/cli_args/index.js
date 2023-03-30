const yargs   = require('yargs-parser')
const _home   = require('os').homedir()
const argsChg = require('./args_chg')
const helper  = require('./helper')

module.exports = () => {
  const argv = yargs(process.argv.slice(2))
  RPC._obj_.argv = argv

  argsChg('h', 'help' )
  argsChg('m', 'mockserver' )
  argsChg('o', 'open' )
  argsChg('s', 'https')
  argsChg('t', 'test' )
  argsChg('x', 'proxy')

  if (argv.help) {
    helper()
  }

  console.log(RPC._obj_)
}
