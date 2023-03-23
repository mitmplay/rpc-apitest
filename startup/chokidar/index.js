const rpc = require('./rpc') // file watcher for RPC

function chokidar() {
  console.log('Chokidar!')
  return rpc()
}
module.exports = chokidar
