const pgsqlConfig = {
  host: process.env.DB_PGSQL_HOST,
  user: process.env.DB_PGSQL_USER,
  password: process.env.DB_PGSQL_PASSWORD,
  database: process.env.DB_PGSQL_DBNAME,
  port: process.env.DB_PGSQL_PORT,
};

module.exports = {
  pgsqlConfig,
};
