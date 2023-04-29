const host = require('dns');
const { resolve } = require('path');

function hostlookup(ipAddress) {
  if (typeof ipAddress!=='string') {
    resolve('unknown')
  } else {
    ipAddress = ipAddress.split(':').pop()
    return new Promise((resolve, reject) => {
      if (ipAddress==='1') {
        resolve('localhost')
      } else {
        host.reverse(ipAddress, (err, hostnames) => {
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
module.exports = hostlookup