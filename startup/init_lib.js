console.log('Start:')
const fs = require('fs-extra')
const fg = require('fast-glob')
const c  = require('ansi-colors')
const chokidar = require('chokidar')
const dir = __dirname.replace(/\\/g, '/').split('/')
global.__app = dir.slice(0, -1).join('/')
console.log(c.yellow(`App Path: ${global.__app}`))

function init_lib() {
  const {argv}  = process
  console.log(c.yellow(`Argv as seen from NodeJS`), argv.map(x=>x.replace(/\\/g, '/')))

  const {_lib_, _obj_} = global.RPC
  _lib_.c  = c
  _lib_.fs = fs
  _lib_.fg = fg
  _lib_.chokidar = chokidar
  import('open').then(async m => {
    _lib_.open = m.default
    if (_obj_.argv.open && !_obj_.argv.test) {
      if (!_obj_.argv.https) {
        await _lib_.open('http://localhost:3001')
      } else {
        await _lib_.open('https://localhost:3002')
      }
    } 
  })
}

module.exports = init_lib
