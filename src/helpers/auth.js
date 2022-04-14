const { verifyPassword } = require('./password');
const log = require('./log');
const { verify } = require('jsonwebtoken');

const getUser = (pool, username) => new Promise((resolve, reject) => {
  const sqlcmd = 'SELECT * FROM bufapi_users WHERE username = $1';
  const params = [username];
  pool.connect().then((client) => client
    .query(sqlcmd, params)
    .then((response) => {
      client.release();
      // console.log(response);
      if (response.rowCount > 0) {
        resolve(response.rows[0]);
      } else {
        reject(new Error('User not found'));
      }
    })
    .catch((err) => {
      client.release();
      reject(err.stack);
    }));
});

const verifySignIn = (pool, username, password) => new Promise((resolve, reject) => {
  getUser(pool, username, password)
    .then((res) => {
      verifyPassword(password, res.password)
        .then((res2) => {
          resolve(res2);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    })
    .catch((err) => {
      // console.error(err);
      reject(err);
    });
});

module.exports = {
  verifySignIn,
};
