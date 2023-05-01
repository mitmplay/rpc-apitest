const rg1 = /\\/g

function xpath(path) {
  const {_obj_: {HOME, argv}} = rpc()
  path = path.replace(rg1,'/')
  if (path.includes(global.__app)) {
    path = path.replace(`${__app}/RPC/`, '')
  } else if (argv.rpcpath) {
    const p = argv.rpcpath.replace(/[/ ]+$/g, '')
    path = path.replace(`${p}/`, '')
  } else {
    path = path.replace(`${HOME}/user-rpc/`, '')
  }
  const [app, typ, ...rest] = path.split('/')
  const name = rest.join('/')
  return [app, typ, name]
}

module.exports = xpath
