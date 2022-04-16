const sql = require('mssql');
const log = require('../../helpers/log');

const createPool = (config) => new Promise((resolve, reject) => {
  log.debug('Trying to connect to database (async)');
  const pool1 = new sql.ConnectionPool(config);

  pool1.on('error', (err) => {
    reject(err);
  });

  resolve(pool1);
});

const createPoolSync = (config) => {
  log.debug('Trying to connect to database (sync)');
  const pool1 = new sql.ConnectionPool(config);

  pool1.on('error', (err) => err);

  return pool1;
};

module.exports = {
  createPool,
  createPoolSync,
};
