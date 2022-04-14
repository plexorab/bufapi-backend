const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { verifySignIn } = require('../helpers/auth');
const log = require('../helpers/log');

module.exports = (app, pool) => {
  /*
  ** This route intercepts everything directed
  ** to /api/bufscan/*
  */
  app.use('/api/bufab', (req, res, next) => {
    // console.log(`DEVELOPMENT_MODE=${process.env.DEVELOPMENT_MODE}`);
    if (process.env.DEVELOPMENT_MODE) {
      console.log('DEVELOPMENT_MODE = true');
      return next();
    }
    if (req.headers.authorization === `Bearer ${process.env.AUTH_TOKEN}`) {
      console.log('Auth OK');
      return next();
    }
    console.log('Auth NOT_OK');
    res.status(401).send({
      success: false,
      data: '',
      message: 'Unauthorized',
    });
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
            res.status(200).send({
              success: true,
              data: response,
              message: 'You are singned in successfully',
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
          console.log(err);
          res.status(400).send({
            success: false,
            data: null,
            message: err.toString(),
          });
        });
    },
  );
};
