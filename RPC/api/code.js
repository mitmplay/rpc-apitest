async function code(nspace, fn) {
  return global.RPC[nspace][fn]+''
}
module.exports = code
