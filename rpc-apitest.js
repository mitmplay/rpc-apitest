const database= require('./database')
const startup = require('./startup')
const server  = require('./server')
const rmtpCall= require('./RPC')
const fn      = startup()

async function run(_fn) {
  const {c} = RPC._lib_
  const [sc, fn] = _fn.split('.')
  if (RPC[sc] && RPC[sc][fn]) {
    try {
      console.log(c.magentaBright(`\nRUN! RPC.${_fn}()`))
      await RPC[sc][fn]('*')       
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
} 

rmtpCall()
database(fn)
const {test} = global.RPC._obj_.argv
if (test) { 
  // execute the test...
  run(test)
} else {
  server()
}
