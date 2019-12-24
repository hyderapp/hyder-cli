const fs = require('fs');
const crypto = require('crypto');


exports.file = function(path) {
  return exports.files([path]);
};

exports.files = async function(paths) {
  const hash = crypto.createHash('sha256');

  const pipe = path => {
    const input = fs.createReadStream(path);
    input.pipe(hash, { end: false });
    return new Promise((resolve, reject) => {
      input.on('end', resolve);
      input.on('error', reject);
    });
  };

  for (const path of paths) {
    await pipe(path);  // eslint-disable-line
  }

  hash.end();

  return hash.digest('hex');
};

