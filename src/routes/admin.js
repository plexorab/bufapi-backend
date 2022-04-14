const { body, validationResult } = require('express-validator');
const { hashPassword } = require('../helpers/password');
const log = require('../log/log');

module.exports = async (app, pool) => {
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //* Get all user
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  app.get('/api/bufab/v1/admin/user/list', (req, res) => {
    pool.connect().then((client) => client
      .query('SELECT * FROM bufapi_users')
      .then((response) => {
        client.release();
        log.info(response);
        res.status(200).send({
          success: true,
          data: response.rows,
          message: 'OK',
        });
      })
      .catch((err) => {
        client.release();
        log.error(err);
        res.status(400).send({
          success: false,
          data: null,
          message: err.stack,
        });
      }));
  });

  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //* Get one user by userid
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  app.get('/api/bufab/v1/admin/user/getById', (req, res) => {
    if (!req.query.userid) {
      res.status(400).send({
        success: false,
        data: null,
        message: 'Query parameter userid is missing',
      });
    } else {
      const sqlcmd = 'SELECT * FROM bufapi_users WHERE userid = $1';
      const params = [req.query.userid];
      pool.connect().then((client) => client
        .query(sqlcmd, params)
        .then((response) => {
          client.release();
          log.info(response);
          res.status(200).send({
            success: true,
            data: response.rows,
            message: 'OK',
          });
        })
        .catch((err) => {
          client.release();
          log.error(err);
          res.status(400).send({
            success: false,
            data: null,
            message: err.stack,
          });
        }));
    }
  });

  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //* Get one user by username
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  app.get('/api/bufab/v1/admin/user/getByName', (req, res) => {
    if (!req.query.username) {
      res.status(400).send({
        success: false,
        data: null,
        message: 'Query parameter username is missing',
      });
    } else {
      const sqlcmd = 'SELECT * FROM bufapi_users WHERE username = $1';
      const params = [req.query.username];
      pool.connect().then((client) => client
        .query(sqlcmd, params)
        .then((response) => {
          client.release();
          log.info(response);
          res.status(200).send({
            success: true,
            data: response.rows,
            message: 'OK',
          });
        })
        .catch((err) => {
          client.release();
          log.error(err);
          res.status(400).send({
            success: false,
            data: null,
            message: err.stack,
          });
        }));
    }
  });

  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //* Create a user
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  app.post(
    '/api/bufab/v1/admin/user/create',
    body('username').isString().isLength({ min: 4 }),
    body('realname').isString(),
    body('password').isString().isLength({ min: 8, max: 64 }),
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      hashPassword(req.body.password)
        .then((hashedPassword) => {
          console.log(hashedPassword);
          const sqlcmd = 'INSERT INTO bufapi_users (username, realname, password) '
        + 'VALUES($1, $2, $3)';
          const params = [req.body.username, req.body.realname, hashedPassword];
          pool.connect().then((client) => client
            .query(sqlcmd, params)
            .then((response) => {
              client.release();
              log.info(response);
              res.status(200).send({
                success: true,
                data: response.rows,
                message: 'OK',
              });
            })
            .catch((err) => {
              client.release();
              log.error(err);
              res.status(400).send({
                success: false,
                data: null,
                message: err.stack,
              });
            }));
        })
        .catch((err) => {
          log.error(err);
          res.status(400).send({
            success: false,
            data: null,
            message: err.stack,
          });
        });
    },
  );
};
