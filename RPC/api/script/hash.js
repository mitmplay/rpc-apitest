const crypto = require('crypto');

async function hash(str='TEST-STRING') {
  const lparams = [...arguments].pop()
  if (lparams==='h') {
    return info()
  }
  const hash = await crypto.createHash('sha256').update(str).digest('hex');
  return hash;
}

function info() {
return `
* console.log(await RPC.api_log.hash('TEST-TEXT'))
`
}
module.exports = hash;

// hash("TEST-STRING")
//   .then(hash => console.log(`SHA-256 hash: ${hash}`));