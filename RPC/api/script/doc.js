async function _doc(run='_readme_', opt={}) {
  const _rpc_ = rpc()
  const {
    _mrkdown_,
    _lib_: {fs, md},
  } = _rpc_

  let path
  if (run==='_readme_') {
    path = _mrkdown_._readme_.path
  } else {
    let [app, ...name] = run.split('/')
    name = name.join('/')
    path = _rpc_[app]._mrkdown_[name].path
  }
  const str = fs.readFileSync(path, 'utf8')
  const result = md.render(str)
  return result
}
module.exports = _doc
