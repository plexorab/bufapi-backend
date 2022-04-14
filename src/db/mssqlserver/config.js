const mssqlConfig = {
  user: process.env.DB_VMI_USER,
  password: process.env.DB_VMI_PASS,
  database: process.env.DB_VMI_NAME,
  server: process.env.DB_VMI_HOST,
  port: parseInt(process.env.DB_VMI_PORT, 10),
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 15000,
  },
  options: {
    // encrypt: false, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
  requestTimeout: 60000,
};

module.exports = {
  mssqlConfig,
};
