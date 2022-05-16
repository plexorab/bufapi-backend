const { body, validationResult } = require('express-validator');
const log = require('../log/log');

module.exports = async (app, pool) => {
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //* Get all endpoints
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  app.get('/api/bufapi/v1/admin/endpoint/list', (req, res) => {
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
  app.get('/api/bufapi/v1/admin/endpoint/getById', (req, res) => {
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
    '/api/bufapi/v1/admin/endpoint/create',
    body('endpointname').isString().isLength({ min: 3 }),
    body('endpointquery').isString(),
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const sqlcmd = 'INSERT INTO bufapi_endpoint (endpointname, endpointquery) '
        + 'VALUES($1, $2)';
      const params = [req.body.endpointname, req.body.endpointquery];
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

  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //* Delete an endpoint
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  app.delete('/api/bufapi/v1/admin/endpoint/delete', (req, res) => {
    if (!req.query.endpointid) {
      res.status(400).send({
        success: false,
        data: null,
        message: 'Query parameter endpointid is missing',
      });
    }
    const sqlcmd = 'DELETE FROM bufapi_endpoint WHERE endpointid = $1';
    const params = [req.query.endpointid];
    pool.connect().then((client) => client
      .query(sqlcmd, params)
      .then((response) => {
        client.release();
        // log.info(JSON.stringify(response));
        res.status(200).send({
          success: true,
          data: response.rowCount,
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
  });

  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //* Edit an endpoint
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  app.patch('/api/bufapi/v1/admin/endpoint/edit', (req, res) => {
    if (!req.query.endpointid || !req.query.endpointname || !req.query.endpointquery) {
      res.status(400).send({
        success: false,
        data: null,
        message: 'Query parameter endpointid, endpointname or endpointquery is missing',
      });
    }
    const sqlcmd = 'UPDATE bufapi_endpoint SET endpointname = $2, '
      + 'endpointquery = $3, updatedat = now() WHERE endpointid = $1';
    const params = [req.query.endpointid, req.query.endpointname, req.query.endpointquery];
    pool.connect().then((client) => client
      .query(sqlcmd, params)
      .then((response) => {
        client.release();
        // log.info(JSON.stringify(response));
        res.status(200).send({
          success: true,
          data: response.rowCount,
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
  });
};
