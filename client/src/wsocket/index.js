const init_ws = require('./init-ws')
const onmsgs  = require('./onmsgs')
const onopen  = require('./onopen')

const ws = init_ws()
onmsgs(ws)
onopen(ws)

module.exports = ws