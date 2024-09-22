const rpc = require('./rpc') // file watcher for RPC
const yml = require('./yml') // file watcher for YML
const md  = require('./md')  // file watcher for MD

function chokidar(_rpc_) {
  const {_obj_: {argv}} = _rpc_
  console.log('Chokidar!')
  return () => {
    rpc(_rpc_)
    yml(_rpc_)
    if (!argv.test) {
      md(_rpc_)
    }
  }
}
module.exports = chokidar
