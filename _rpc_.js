const {
  name: _name_,
  version: _version_
} = require('./package.json')

const _db_     = {}
const _fn_     = {}
const _obj_    = {}
const _lib_    = {}
const apitest  = {}
const _watcher_= {}

let _rpc_ = {
  _db_,
  _fn_,
  _obj_,
  _lib_,
  _name_,
  apitest,
  _watcher_,
  _version_,
}

const rpc = o => {
  if (o===undefined) {
    return _rpc_
  } else {
    _rpc_ = {
      ..._rpc_,
      ...o
    }
  }
}
global.rpc = rpc 
module.exports = rpc