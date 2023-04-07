module.exports = _rpc_ => {
  const {
    _version_,
    _lib_: {c},
  } = _rpc_
  console.log(c.greenBright(
  `
  Usage: rpc-apitest [options]
  
  options:
    -h --help       \t show this help
    -m --mockserver \t def: http://127.0.0.1:4010
    -o --open       \t open the browser
    -s --https      \t change to https
    -t --test       \t func() to test
    -x --proxy      \t a proxy request

  v${_version_}
`))
process.exit(0)
}
