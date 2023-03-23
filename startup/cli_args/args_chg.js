function argsChg (id, key) {
  const { argv } = RPC._obj_
  if (id && argv[id]) {
    argv[key] = argv[id]
    delete argv[id]
  }

  if (argv[key] === 'false') {
    argv[key] = false
  }
}
module.exports = argsChg
