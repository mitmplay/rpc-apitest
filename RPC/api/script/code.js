async function code(nspace='api', name='code') {
  return rpc()[nspace][name]+'';
}
module.exports = code
