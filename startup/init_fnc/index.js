const dnslookup = require('./dnslookup')
const tildehome = require('./tildehome')
const request   = require('./request')
const nanoid    = require('./nanoid')
const apilog    = require('./apilog')

function fn() {
  const {_home, _win32, ...thome} = tildehome
  global.RPC._obj_.win32 = _win32
  global.RPC._obj_.HOME  = _home
  global.RPC._fn_ = {
    ...global.RPC._fn_,
    ...thome,
    dnslookup,
    request,
    nanoid,
    apilog,
  }
}
module.exports = fn
