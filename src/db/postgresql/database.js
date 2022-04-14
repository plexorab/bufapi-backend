const { Pool } = require('pg');
const { pgsqlConfig } = require('./config');

const pgsqlCreatePool = () => {
  const pool = new Pool(pgsqlConfig);
  console.log('PostgreSQL pool created.');
  return pool;
};

module.exports = {
  pgsqlCreatePool,
};
