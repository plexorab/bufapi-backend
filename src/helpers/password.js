const crypto = require('crypto');

const hashPassword = (password) => new Promise((resolve, reject) => {
  // generate random 16 bytes long salt
  const salt = crypto.randomBytes(16).toString('hex');

  crypto.scrypt(password, salt, 64, (err, derivedKey) => {
    if (err) reject(err);
    resolve(`${salt}:${derivedKey.toString('hex')}`);
  });
});

const verifyPassword = (password, hash) => new Promise((resolve, reject) => {
  const [salt, key] = hash.split(':');
  crypto.scrypt(password, salt, 64, (err, derivedKey) => {
    if (err) reject(err);
    resolve(key === derivedKey.toString('hex'));
  });
});

module.exports = {
  hashPassword,
  verifyPassword,
};
