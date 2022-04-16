const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const log = require('./log');

const addMinutes = (date, minutes) => moment(date).add(minutes, 'm').toDate();

const createSession = (pool, username, clientip) => new Promise((resolve, reject) => {
  const uuid = uuidv4();
  const timeNow = moment().format();
  const expires = addMinutes(timeNow, process.env.SESSION_TTL);
  console.log('timeNow = ', timeNow);
  console.log('expires = ', expires);
  const sqlcmd = 'INSERT INTO bufapi_session(sessionid, username, clientip, createdat, expiresat)'
    + ' VALUES($1,$2,$3,$4,$5) RETURNING sessionid';
  const params = [uuid, username, clientip, timeNow, expires];
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
      if (response.rowCount === 0) {
        resolve({
          success: false,
          data: 'Invalid sessionid',
        });
      } else {
        // const timeNow = moment().utcOffset(0, true).format();
        const timeNow = moment().format();
        console.log('timeNow = ', timeNow);
        console.log('expires = ', response.rows[0].expiresat);
        if (timeNow > response.rows[0].expiresat) {
          // console.log('Session has expired');
          resolve({
            success: false,
            data: null,
          });
        } else {
          // console.log('Session is valid and has not expired');
          resolve({
            success: true,
            data: response.rows[0],
          });
        }
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
