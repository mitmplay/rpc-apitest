const rpc = require('./rpc') // file watcher for RPC
const yml = require('./yml') // file watcher for RPC

function chokidar(_rpc_) {
  console.log('Chokidar!')
  return () => {
    rpc(_rpc_)
    yml(_rpc_)
  }
}
module.exports = chokidar
