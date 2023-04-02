const dns = require('dns');

function dnslookup(ipAddress) {
  ipAddress = ipAddress.split(':').pop()
  return new Promise((resolve, reject) => {
    dns.reverse(ipAddress, (err, hostnames) => {
      if (err) {
        reject(err);
      } else {
        resolve(hostnames);
      }
    });
  });
}
module.exports = dnslookup