const rg1 = /\\/g

function xpath(path) {
  const {_obj_: {argv}} = rpc()
  path = path.replace(rg1,'/')
  if (path.includes(global.__app)) {
    path = path.replace(`${__app}/RPC/`, '')
  } else if (argv.rpcpath) {
    const p = argv.rpcpath.replace(/[/ ]+$/g, '')
    path = path.replace(`${p}/`, '')
  }
  const [app, typ, ...rest] = path.split('/')
  const name = rest.join('/')
  return [app, typ, name]
}

module.exports = xpath
