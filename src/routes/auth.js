const requestIp = require('request-ip');
const { body, validationResult } = require('express-validator');
const { verifySignIn } = require('../helpers/auth');
const { createSession, validateSession } = require('../helpers/session');
// const log = require('../helpers/log');

module.exports = (app, pool) => {
  app.use(requestIp.mw());

  app.use((req, res, next) => {
    const ip = req.clientIp;
    res.locals.clientip = ip;
    return next();
  });
  /*
  ** This route intercepts everything directed
  ** to /api/bufab/*
  */
  app.use('/api/bufab', (req, res, next) => {
    if (process.env.DEVELOPMENT_MODE > 0) {
      console.log('DEVELOPMENT_MODE');
      return next();
    }
    if (req.originalUrl === process.env.SIGNIN_URL) {
      return next();
    }
    if (!req.headers.sessionid) {
      res.status(401).send({
        success: false,
        data: null,
        message: 'No sessionid supplied',
      });
    } else {
      validateSession(pool, req.headers.sessionid)
        .then((r) => {
          if (r.success) {
            return next();
          }
          res.status(401).send({
            success: false,
            data: null,
            message: r.data,
          });
        })
        .catch((e) => {
          console.error(e);
          res.status(401).send({
            success: false,
            data: null,
            message: 'Invalid sessionid',
          });
        });
    }
  });

  app.get('/api/bufab/v1/auth/signin', (req, res) => {
    if (!req.query.username || !req.query.password) {
      res.status(400).send({
        success: false,
        data: null,
        message: 'Query parameters username and/or password is missing',
      });
    } else {
      verifySignIn(pool, req.query.username, req.query.password)
        .then((response) => {
          if (response) {
            createSession(pool, req.query.username, res.locals.clientip)
              .then((r) => {
                res.status(200).send({
                  success: true,
                  data: r,
                  message: 'You are signed in successfully',
                });
              })
              .catch((e) => {
                res.status(400).send({
                  success: false,
                  data: null,
                  message: e.toString(),
                });
              });
          } else {
            res.status(200).send({
              success: false,
              data: null,
              message: 'Invalid username or password',
            });
          }
        })
        .catch((err) => {
          res.status(400).send({
            success: false,
            data: null,
            message: err.toString(),
          });
        });
    }
  });

  app.post(
    '/api/bufab/v1/auth/signin',
    body('username').isString(),
    body('password').isString(),
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      verifySignIn(pool, req.body.username, req.body.password)
        .then((response) => {
          if (response) {
            createSession(pool, req.body.username, res.locals.clientip)
              .then((r) => {
                res.status(200).send({
                  success: true,
                  data: r,
                  message: 'You are signed in successfully',
                });
              })
              .catch((e) => {
                res.status(400).send({
                  success: false,
                  data: null,
                  message: e.toString(),
                });
              });
          } else {
            res.status(200).send({
              success: false,
              data: null,
              message: 'Invalid username or password',
            });
          }
        })
        .catch((err) => {
          res.status(400).send({
            success: false,
            data: null,
            message: err.toString(),
          });
        });
    },
  );
};
