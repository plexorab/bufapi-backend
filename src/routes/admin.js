const { body, validationResult } = require('express-validator');
const { hashPassword } = require('../helpers/password');
const { changeUsersPassword } = require('../helpers/admin');
const log = require('../log/log');

module.exports = async (app, pool) => {
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //* Get all user
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  app.get('/api/bufab/v1/admin/user/list', (req, res) => {
    pool.connect().then((client) => client
      .query('SELECT * FROM bufapi_user')
      .then((response) => {
        client.release();
        // Obfuscate password in response
        const rObj = response.rows.map((e) => {
          e.password = '******';
          return e;
        });
        res.status(200).send({
          success: true,
          data: rObj,
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
      const sqlcmd = 'SELECT * FROM bufapi_user WHERE userid = $1';
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
      const sqlcmd = 'SELECT * FROM bufapi_user WHERE username = $1';
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

  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //* Delete a user
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  app.delete('/api/bufab/v1/admin/user/delete', (req, res) => {
    if (!req.query.userid) {
      res.status(400).send({
        success: false,
        data: null,
        message: 'Query parameter userid is missing',
      });
    }
    const sqlcmd = 'DELETE FROM bufapi_user WHERE userid = $1';
    const params = [req.query.userid];
    pool.connect().then((client) => client
      .query(sqlcmd, params)
      .then((response) => {
        client.release();
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
  //* Edit a user
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  app.patch('/api/bufab/v1/admin/user/edit', (req, res) => {
    console.log(req.query);
    if (!req.query.userid || !req.query.username || !req.query.realname) {
      res.status(400).send({
        success: false,
        data: null,
        message: 'Query parameter userid, username or realname is missing',
      });
    }
    const sqlcmd = 'UPDATE bufapi_user SET username = $2, '
      + 'realname = $3, updatedat = now() WHERE userid = $1';
    const params = [req.query.userid, req.query.username, req.query.realname];
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
  //* Change a users password
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  app.post(
    '/api/bufab/v1/admin/user/pwchange',
    body('userid').isNumeric(),
    body('password').isString().isLength({ min: 8, max: 64 }),
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      changeUsersPassword(pool, req.body.userid, req.body.password)
        .then((response) => {
          if (response === 0) {
            res.status(200).send({
              success: false,
              data: response,
              message: 'User not found',
            });
          } else {
            res.status(200).send({
              success: true,
              data: response,
              message: 'Users password changed successfully',
            });
          }
        })
        .catch((error) => {
          res.status(400).send({
            success: false,
            data: null,
            message: error.stack,
          });
        });
    },
  );
};
