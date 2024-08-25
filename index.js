const start = require('./start')
const server= require('./server')

start()
require('./database')
require('./RPC')
server()
