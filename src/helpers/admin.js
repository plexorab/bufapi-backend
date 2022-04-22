const { hashPassword } = require('./password');

const updateUser = (pool, userid, password) => new Promise((resolve, reject) => {
  const sqlcmd = 'UPDATE bufapi_user SET password = $2, '
    + 'updatedat = now() WHERE userid = $1';
  const params = [userid, password];
  pool.connect().then((client) => client
    .query(sqlcmd, params)
    .then((response) => {
      client.release();
      resolve(response.rowCount);
    })
    .catch((err) => {
      client.release();
      reject(err);
    }))
    .catch((err) => {
      reject(err);
    });
});

const changeUsersPassword = async (pgpool, userid, password) => {
  try {
    const hashedPassword = await hashPassword(password);
    const response = await updateUser(pgpool, userid, hashedPassword);
    return response;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  changeUsersPassword,
};
