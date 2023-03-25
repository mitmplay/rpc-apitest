let initToggle = 1

function yml() {
  const {
    _fn_ : {tilde},
    _obj_: {HOME, argv},
    _lib_: {chokidar, YAML, fs, fg, c}
  } = global.RPC

  const broadcast = () => {}

  let timeout = false
  function initEnd() {
    if (initToggle) {
      console.log(c.magentaBright(`>>> YAML watcher OK`))
      initToggle = 0
    }
  }
  function loadYAML(path, msg) {
    let [app,yml] = path.replace(/\\/g,'/') .split('/').slice(-2)
    const name = yml.replace(/\.yaml$/, '')

    if (!global.RPC[app]._YAML_) {
      global.RPC[app]._YAML_ = {}
    }

    const str = fs.readFileSync(path, 'utf8')
    global.RPC[app]._YAML_[name] = YAML.parse(str)

    console.log(msg, {app,yml})
    if (!argv.test && initToggle) {
      timeout && clearTimeout(timeout)
      timeout = setTimeout(initEnd, 1000)
    }
  }

  function update(path, msg) {
    loadYAML(path, msg, broadcast)
  }

  function remove (path, msg) {
    console.log('removeYAML', path)
  }

  // Initialize watcher.
  const path = `${HOME}/user-rpc/*/*.yaml`
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
    .on('unlink', _ => { _ =   remove(_, 'del') })
    global.RPC._watcher_.uYMLWatcher = uYMLWatcher
  }
}
module.exports = yml
