const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const log = require('./log');

const addMinutes = (date, minutes) => moment(date).add(30, 'm').toDate();

const createSession = (pool) => new Promise((resolve, reject) => {
  const uuid = uuidv4();
  const timeNow = moment().utcOffset(0, true).format();
  const expires = addMinutes(timeNow, process.env.SESSION_TTL);
  // console.log('timeNow = ', timeNow);
  // console.log('expires = ', expires);
  const sqlcmd = 'INSERT INTO bufapi_session(sessionid, createdat, expiresat)'
  	+ ' VALUES($1,$2,$3) RETURNING sessionid';
  const params = [uuid, timeNow, expires];
  pool.connect().then((client) => client
    .query(sqlcmd, params)
    .then((response) => {
      client.release();
      resolve(response.rows[0]);
    })
    .catch((err) => {
      client.release();
      log.error(err);
      reject(err);
    }));
});

const validateSession = (pool, sessionid) => new Promise((resolve, reject) => {
  const sqlcmd = 'SELECT * FROM bufapi_session WHERE sessionid = $1';
  const params = [sessionid];
  pool.connect().then((client) => client
    .query(sqlcmd, params)
    .then((response) => {
      client.release();
      const timeNow = moment().utcOffset(0, true).format();
      // console.log('timeNow = ', timeNow);
  	  // console.log('expires = ', response.rows[0].expiresat);
      if (timeNow > response.rows[0].expires) {
      	// console.log('Session has expired');
      	resolve(false);
      } else {
      	// console.log('Session is valid and has not expired');
      	resolve(true);
      }
    })
    .catch((err) => {
      client.release();
      log.error(err);
      reject(err);
    }));
});

module.exports = {
  createSession,
  validateSession,
};
