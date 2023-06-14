const swgtorequest = require('./swgtorequest')
const xpath = require('./xpath')
const _rpc  = require('../../_rpc_')

let initToggle = 1

function yml(_rpc_) {
  const {
    _fn_ : {tilde},
    _obj_: {HOME, argv},
    _lib_: {chokidar, YAML, fs, fg, c}
  } = _rpc_

  const broadcast = async (method, obj) => {
    const RPC = rpc()
    const {_broadcast2} = RPC._fn_
    if (initToggle || !_broadcast2) {
      return
    }
    _broadcast2(method, '')
    // const {request} = RPC.api
    // if (method.includes('_template_')) {
    //   const [app, ...folders] = method.split(/[:/]/).slice(1,-1)
    //   const pth = folders.join('/')
    //   const requests = RPC[app]._request_
    //   const keys = Object.keys(requests).map(x=>{
    //     if (x.includes('_template_')) {
    //       x = x.replace(/_template_$/, '-template-')
    //     }
    //     return x
    //   }).sort()
    //   for (const id of keys) {
    //     let path = id
    //     if (id.includes('-template-')) {
    //       path = id.replace(/-template-$/,'_template_')
    //     }
    //     if (path.includes(pth)) {
    //       const path2 = `${app}/${path}`
    //       const method2 = `request:${path2}`
    //       _broadcast2(method2, '')
    //     }
    //   }
    // } else {
    //   const [_, path] = method.split(/:/)
    //   const reqs = await request(path)
    //   console.log(method, reqs)
    //   _broadcast2(method, reqs)
    // }
  }

  let timeout = false
  function initEnd() {
    if (initToggle) {
      console.log(c.magentaBright(`>>> YAML watcher OK`))
      initToggle = 0
      swgtorequest(_rpc_)
      _rpc(_rpc_)
    }
  }

  function loadYAML(path, msg, broadcast) {
    let [app, typ, name] = xpath(path)
    name = name.replace(/\.yaml$/, '')
    if (!_rpc_[app]) {
      _rpc_[app] = {
        _mrkdown_: {},
        _openapi_: {},
        _request_: {},
        _request_src_: {},
      }
    } else if (!_rpc_[app]._openapi_) {
      _rpc_[app]._mrkdown_= {}
      _rpc_[app]._openapi_= {}
      _rpc_[app]._request_= {}
      _rpc_[app]._request_src_= {}
    }

    const str = fs.readFileSync(path, 'utf8')
    const obj = YAML.parse(str)
    if (obj===null) {
      return
    } else if (obj.openapi) {
      _rpc_[app]._openapi_[name] = obj
    } else {
      _rpc_[app]._request_[name] = obj
      _rpc_[app]._request_src_[name] = str
    }

    // const typ = obj.openapi ? 'openapi' : 'request'
    console.log(msg,  JSON.stringify({app, typ, name}))
    if (!argv.test) { 
      if (initToggle) {
        timeout && clearTimeout(timeout)
        timeout = setTimeout(initEnd, 1000)
      }
      const method = `${typ}:${app}/${name}`
      broadcast(method, {})
    }
  }

  function update(path, msg) {
    loadYAML(path, msg, broadcast)
    timeout = setTimeout(initEnd, 1000)
    initToggle = 1
  }

  function removeYAML(path, msg, broadcast) {
    const RPC = rpc()
    const {_broadcast2} = RPC._fn_
    let [app, typ, name] = xpath(path)
    name = name.replace(/\.yaml$/, '')
    if (_rpc_[app]._openapi_[name]) {
      delete _rpc_[app]._openapi_[name]
    }
    if (_rpc_[app]._request_[name]) {
      delete _rpc_[app]._request_[name]
    }
    console.log(msg,  JSON.stringify({app, typ, name}))
    if (!argv.test) { 
      const method = `${typ}:${app}/${name}`
      _broadcast2(method, {del: true})
      initToggle = 0
    }
  }

  function remove (path, msg) {
    removeYAML(path, msg, broadcast)
  }

  // Initialize watcher.
  const path = []
  if (_rpc_._obj_.argv.devmode) {
    path.push(`${__app}/RPC/*/request/**/*.yaml`)
    path.push(`${__app}/RPC/*/openapi/**/*.yaml`)
  }
  const rpath = argv.rpcpath || `${HOME}/user-rpc`
  path.push(`${rpath}/*/request/**/*.yaml`)
  path.push(`${rpath}/*/openapi/**/*.yaml`)

  if (argv.test) {
    console.log(c.magentaBright(`>>> YAML loader:`), [tilde(path)])
    const arr = fg.sync([path], { dot: false })
    arr.forEach(_ =>{
      !/\/_.*\.yaml$/.test(_) && loadYAML(_, 'load', broadcast)
    })  
  } else {
    console.log(c.magentaBright(`>>> YAML watcher:`), [tilde(path)])
    const uYMLWatcher = chokidar.watch([path], {
      ignored: /\/_.*\.js$/, // ignore files
      persistent: true
    })
    // Something to use when events are received.
    uYMLWatcher // Add event listeners.
    .on('add',    _ => { _ = update(_, 'add') })
    .on('change', _ => { _ = update(_, 'chg') })
    .on('unlink', _ => { _ = remove(_, 'del') })
    _rpc_._watcher_.uYMLWatcher = uYMLWatcher
  }
}
module.exports = yml
