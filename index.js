const startup = require('./startup')
const server  = require('./server')

startup()
require('./database')
require('./RPC')
server()
