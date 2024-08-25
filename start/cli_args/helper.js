module.exports = _rpc_ => {
  const {
    _version_,
    _lib_: {c},
  } = _rpc_
  console.log(c.greenBright(
  `
  Usage: rpc-apitest [options]
  
  options:
    -d --devmode    \t running in devmode
    -h --help       \t show this help
    -j --json       \t show request in JSON
    -m --mockserver \t def: http://127.0.0.1:4010
    -o --open       \t open the browser
    -r --rpcpath    \t path of user-rpc
    -s --https      \t change to https
    -t --test       \t func() to test
    -x --proxy      \t a proxy request

    -D --debug      \t more info on logs
    -T --timeout    \t delay:100 before broadcast
    -V --verbose    \t more info on console logs

  v${_version_}
`))
process.exit(0)
}
