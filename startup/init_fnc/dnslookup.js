const dns = require('dns');
const { resolve } = require('path');

function dnslookup(ipAddress) {
  if (typeof ipAddress!=='string') {
    resolve('undefined')
  } else {
    ipAddress = ipAddress.split(':').pop()
    return new Promise((resolve, reject) => {
      if (ipAddress==='1') {
        resolve('LOCALHOST')
      } else {
        dns.reverse(ipAddress, (err, hostnames) => {
          if (err) {
            reject(err);
          } else {
            resolve(hostnames);
          }
        });  
      }
    });  
  }
}
module.exports = dnslookup