const api_log = require('./api_log')
const apidemo = require('./apidemo')
const process = require('./process')

function RPC() {
  global.RPC = {
    ...global.RPC,
    api_log,
    apidemo,
    process,
  }  
}
module.exports = RPC
//https://www.jsonapi.co/public-api