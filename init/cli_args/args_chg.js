module.exports = function ({argv}) {
  function argsChg (id, key) {
    if (id && argv[id]) {
      argv[key] = argv[id]
      delete argv[id]
    }
  
    if (argv[key] === 'false') {
      argv[key] = false
    }
  }
  return argsChg
}
