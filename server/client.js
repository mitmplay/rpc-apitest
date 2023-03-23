function ism() {
  let msg = ``
  const {RPC} = global
  for (const k1 in RPC) {
    if (/^_.+_$/.test(k1)) {
      continue
    }
    msg += `window.RPC['${k1}'] = {\n`
    for (const k2 in RPC[k1]) {
      msg += `  async ${k2}() {
    const args = Array.prototype.slice.call(arguments);
    return await sendRequest('${k1}.${k2}', args)
  },
`
    }
    msg += '}\n'
  }
  return msg
}

module.exports = ism
