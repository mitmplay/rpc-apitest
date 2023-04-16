const fn  = require('../../_rpc_')

async function code(nspace='api', name='code') {
  return fn()[nspace][name]+'';
}
module.exports = code
