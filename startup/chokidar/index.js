const rpc = require('./rpc') // file watcher for RPC
const yml = require('./yml') // file watcher for YML
const md  = require('./md')  // file watcher for MD

function chokidar(_rpc_) {
  console.log('Chokidar!')
  return () => {
    rpc(_rpc_)
    yml(_rpc_)
    md(_rpc_)
  }
}
module.exports = chokidar
