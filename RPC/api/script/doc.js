const rMermaid = /\^\^\^ mermaid +([^\n]+)\n(.+?(?=\^\^\^))\^\^\^/s

async function _doc(run='_readme_', opt={}) {
  const _rpc_ = rpc()
  const {
    _mrkdown_,
    _lib_: {fs, md},
  } = _rpc_

  function _mermaid(match, p1, p2) {
    return `
    <div class="details _mermaid_" title="${md.renderInline(p1)}">
    <div class="mermaid">
    ${p2}
    </div>
    </div>
    `
  }

  let path
  if (run==='_readme_') {
    path = _mrkdown_._readme_.path
  } else {
    let [app, ...name] = run.split('/')
    name = name.join('/')
    path = _rpc_[app]._mrkdown_[name].path
  }
  let str = fs.readFileSync(path, 'utf8')
  str = md.render(str)
  while (str.match(rMermaid)) {
    str = str.replace(rMermaid, _mermaid)
  }
  return str
}
module.exports = _doc
