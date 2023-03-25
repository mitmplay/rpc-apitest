const rpc = require('./rpc') // file watcher for RPC
const yml = require('./yml') // file watcher for RPC

function chokidar() {
  console.log('Chokidar!')
  return () => {
    rpc()
    yml()
  }
}
module.exports = chokidar
