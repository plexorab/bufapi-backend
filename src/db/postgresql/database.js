const pg = require('pg');
const log = require('../../helpers/log');
const { pgsqlConfig } = require('./config');

pg.types.setTypeParser(1114, (stringValue) => new Date(Date.parse(`${stringValue}+0000`)));

const pgsqlCreatePool = () => {
  const pool = new pg.Pool(pgsqlConfig);
  log.info('PostgreSQL pool created.');
  return pool;
};

module.exports = {
  pgsqlCreatePool,
};
