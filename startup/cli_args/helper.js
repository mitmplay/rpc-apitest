module.exports = () => {
  const {
    _version_,
    _lib_: {c},
  } = global.RPC
  console.log(c.greenBright(
  `
  Usage: rpc-apitest [options]
  
  options:
    -h --help     \t show this help
    -o --open     \t open the browser
    -s --https    \t change to https
    -t --test     \t func() to test
    -x --proxy    \t a proxy request

  v${_version_}
`))
process.exit(0)
}
