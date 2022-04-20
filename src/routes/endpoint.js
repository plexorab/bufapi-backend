const { body, validationResult } = require('express-validator');
const { hashPassword } = require('../helpers/password');
const log = require('../log/log');

module.exports = async (app, pool) => {
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //* Get all endpoints
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  app.get('/api/bufab/v1/admin/endpoint/list', (req, res) => {
    pool.connect().then((client) => client
      .query('SELECT * FROM bufapi_endpoint')
      .then((response) => {
        client.release();
        res.status(200).send({
          success: true,
          data: response.rows,
          message: 'OK',
        });
      })
      .catch((err) => {
        client.release();
        // log.error(err);
        res.status(400).send({
          success: false,
          data: null,
          message: err.stack,
        });
      }));
  });

  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //* Get one endpoint by endpointid
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  app.get('/api/bufab/v1/admin/endpoint/getById', (req, res) => {
    if (!req.query.endpointid) {
      res.status(400).send({
        success: false,
        data: null,
        message: 'Query parameter endpointid is missing',
      });
    } else {
      const sqlcmd = 'SELECT * FROM bufapi_endpoint WHERE endpointid = $1';
      const params = [req.query.endpointid];
      pool.connect().then((client) => client
        .query(sqlcmd, params)
        .then((response) => {
          client.release();
          // log.info(JSON.stringify(response));
          res.status(200).send({
            success: true,
            data: response.rows,
            message: 'OK',
          });
        })
        .catch((err) => {
          client.release();
          // log.error(err);
          res.status(400).send({
            success: false,
            data: null,
            message: err.stack,
          });
        }));
    }
  });

  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //* Create an endpoint
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
          const sqlcmd = 'INSERT INTO bufapi_user (username, realname, password) '
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
            }))
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
