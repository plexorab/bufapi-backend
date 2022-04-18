switch (process.env.NODE_ENV) {
  case 'development':
    console.log(`Running in ${process.env.NODE_ENV} environment`);
    require('dotenv').config({ path: '.env.development' });
    break;
  case 'bufdev':
    console.log(`Running in ${process.env.NODE_ENV} environment`);
    require('dotenv').config({ path: '.env.bufdev' });
    break;
  case 'test':
    console.log(`Running in ${process.env.NODE_ENV} environment`);
    require('dotenv').config({ path: '.env.test' });
    break;
  case 'production':
    console.log(`Running in ${process.env.NODE_ENV} environment`);
    require('dotenv').config({ path: '.env.production' });
    break;
  default:
    console.log('NODE_ENV not set');
    process.exit(-1);
    break;
}

const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const logger = require('morgan');
const pgsql = require('./db/postgresql/database');

const pgpool = pgsql.pgsqlCreatePool();

const app = express();

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
};

app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression({
  filter: shouldCompress,
  level: 7,
}));

require('./routes/auth')(app, pgpool);
require('./routes/admin')(app, pgpool);
require('./routes/dynapi')(app, pgpool);
// require('./routes/superoffice')(app, pool);

module.exports = app;
