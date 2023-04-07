const dnslookup = require('./dnslookup')
const tildehome = require('./tildehome')
const request   = require('./request')
const nanoid    = require('./nanoid')
const apilog    = require('./apilog')

function fn(_rpc_) {
  const {_home, _win32, ...thome} = tildehome
  _rpc_._obj_.win32 = _win32
  _rpc_._obj_.HOME  = _home
  _rpc_._fn_ = {
    ..._rpc_._fn_,
    ...thome,
    dnslookup,
    request,
    nanoid,
    apilog,
  }
}
module.exports = fn
