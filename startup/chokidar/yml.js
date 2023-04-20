const swgtorequest = require('./swgtorequest')
const fn  = require('../../_rpc_')

let initToggle = 1
const rg1 = /\\/g
const rg2 = /\/(user-rpc|RPC)\/([\w-]+)\/(request|openapi)\/(.+)\.yaml/

function yml(_rpc_) {
  const {
    _fn_ : {tilde},
    _obj_: {HOME, argv},
    _lib_: {chokidar, YAML, fs, fg, c}
  } = _rpc_

  const broadcast = async (method, obj) => {
    const RPC = rpc()
    const _broadcast2 = RPC._fn_._broadcast2
    if (_broadcast2) {
      _broadcast2(method, obj)

      if (initToggle===0 && method.includes('_template_')) {
        const folders = method.split(/[:/]/).slice(1,-1)
        const app = folders.shift()
        const pth = folders.join('/')
        const requests = RPC[app]._request_
        for (const path in requests) {
          if (path.includes(pth)) {
            const path2 = `${app}/${path}`
            const method2 = `request:${path2}`
            if (method!==method2) {
              const reqs = await RPC.api.request(path2)
              console.log(method2, reqs)
              _broadcast2(method2, reqs)
            }
          }
        }
      }  
    }
  }

  let timeout = false
  function initEnd() {
    if (initToggle) {
      console.log(c.magentaBright(`>>> YAML watcher OK`))
      initToggle = 0
      swgtorequest(_rpc_)
      fn(_rpc_)
    }
  }

  function loadYAML(path, msg, broadcast) {
    let [app, typ, name] = path.replace(rg1,'/').match(rg2).slice(2)
  
    if (!_rpc_[app]) {
      _rpc_[app] = {
        _YAML_   : {},
        _openapi_: {},
        _request_: {},
      }
    } else if (!_rpc_[app]._YAML_) {
      _rpc_[app]._YAML_   = {}
      _rpc_[app]._openapi_= {}
      _rpc_[app]._request_= {}
    }

    const str = fs.readFileSync(path, 'utf8')
    const obj = YAML.parse(str)
    if (obj.openapi) {
      _rpc_[app]._YAML_[name] = obj
    } else {
      _rpc_[app]._request_[name] = obj
    }

    // const typ = obj.openapi ? 'openapi' : 'request'
    console.log(msg,  JSON.stringify({app, typ, name}))
    if (!argv.test) { 
      if (initToggle) {
        timeout && clearTimeout(timeout)
        timeout = setTimeout(initEnd, 1000)
      }
      const method = `${typ}:${app}/${name}`
      broadcast(method, obj)
    }
  }

  function update(path, msg) {
    loadYAML(path, msg, broadcast)
    timeout = setTimeout(initEnd, 1000)
    initToggle = 1
  }

  function remove (path, msg) {
    console.log('removeYAML', path)
  }

  // Initialize watcher.
  const path = []
  if (_rpc_._obj_.argv.devmode) {
    path.push(`${__app}/RPC/*/request/**/*.yaml`)
    path.push(`${__app}/RPC/*/openapi/**/*.yaml`)
  }
  path.push(`${HOME}/user-rpc/*/request/**/*.yaml`)
  path.push(`${HOME}/user-rpc/*/openapi/**/*.yaml`)

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
