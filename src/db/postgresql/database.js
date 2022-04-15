const pg = require('pg');
const { pgsqlConfig } = require('./config');

pg.types.setTypeParser(1114, function(stringValue) {
    return new Date(Date.parse(stringValue + "+0000"));
});

const pgsqlCreatePool = () => {
  const pool = new pg.Pool(pgsqlConfig);
  console.log('PostgreSQL pool created.');
  return pool;
};

module.exports = {
  pgsqlCreatePool,
};
