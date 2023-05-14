async function docs() {
  const _rpc_ = rpc()
  let docs1 = {}
  docs1._readme_ = {run: '_readme_'}
  for (const app in _rpc_) {
    if (_rpc_[app]._mrkdown_) {
      const json = _rpc_._fn_.toTreeObj(app, _rpc_[app]._mrkdown_)
      if (Object.keys(json).length) {
        docs1[app] = json
      }
    }
  }
  return docs1
}
module.exports = docs