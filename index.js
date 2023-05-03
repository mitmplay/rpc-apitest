const startup = require('./init')
const server  = require('./server')

startup()
require('./database')
require('./RPC')
server()
