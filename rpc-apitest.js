const start = require('./start')
const RPC   = require('./RPC')
const DB    = require('./DB')
const {_rpc_,fn} = start()

async function run(_fn) {
  const {c} = _rpc_._lib_
  const [fn, sc] = _fn.split('@')
  if (_rpc_[sc]) {
    if (_rpc_[sc][fn]) {
      try {
        console.log(c.magentaBright(`\nRUN! RPC['${sc}'].${fn}('*')`))
        await _rpc_[sc][fn]('*')       
        process.exit(0)
      } catch (err) {
        console.error(err)      
        process.exit(2)
      }
    } else {
      const msg1 = c.red(`\nERROR!!!, `)
      const msg2 = c.magenta(`No function: `)
      const msg3 = c.magentaBright(`RPC.${_fn}()`)
      console.error(msg1+msg2+msg3)
      process.exit(1)
    }
  } else {
    const msg1 = c.red(`\nERROR!!!, `)
    const msg2 = c.magenta(`No name-space: `)
    const msg3 = c.magentaBright(`RPC.${_fn}()`)
    console.error(msg1+msg2+msg3)
    process.exit(1)
  }
}

global.__app = __dirname.replace(/\\/g, '/')
var {test} = _rpc_._obj_.argv
RPC(_rpc_)
DB(fn)
if (test) { 
  // execute the test...
  run(test)
} else {
  require('./server')()
}
