async function code(nspace='api', fn='code') {
  return global.RPC[nspace][fn]+'';
}
module.exports = code
