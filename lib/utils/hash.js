const fs = require('fs');
const crypto = require('crypto');


exports.file = function(path) {
  const hash = crypto.createHash('sha256');
  const input = fs.createReadStream(path);
  input.pipe(hash);
  return new Promise((resolve, reject) => {
    input.on('end', () => {
      resolve(hash.digest('hex'));
    });
    input.on('error', reject);
  });
};
