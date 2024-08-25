const rpc       = require('../../_rpc_')
const hostlookup= require('./hostlookup')
const toTreeObj = require('./totreeobj')
const tildehome = require('./tildehome')
const broadcast = require('./broadcast')
const timeout   = require('./timeout')
const request   = require('./request')
const nanoid    = require('./nanoid')
const apilog    = require('./apilog')
const merge     = require('./merge')

function fn(_rpc_) {
  const {_broadcast, _broadcast2} = broadcast
  const {_home, _win32, ...thome} = tildehome
  _rpc_._obj_.win32 = _win32
  _rpc_._obj_.HOME  = _home
  _rpc_._fn_ = {
    ..._rpc_._fn_,
    ...thome,
    _broadcast2,
    _broadcast,
    hostlookup,
    toTreeObj,
    timeout,
    request,
    nanoid,
    apilog,
    merge,
    rpc,
  }
}
module.exports = fn
