const clc = require('cli-color');
const moment = require('moment-timezone');

/*
 ** LOGGING=0 - No logging
 ** LOGGING=1 - Informational messages
 ** LOGGING=2 - Debug messages
 */

exports.info = (text) => {
  if (parseInt(process.env.LOGGING, 10) >= 1) {
    const now = moment(Date.now());
    now.tz(process.env.LOG_TIMEZONE);
    now.format('YYYY-MM-DDTHH:mm:ss');
    console.log(clc.green(`[${now}] : ${text}`));
  }
};

exports.debug = (text) => {
  if (parseInt(process.env.LOGGING, 10) >= 2) {
    const now = moment(Date.now());
    now.tz(process.env.LOG_TIMEZONE);
    now.format('YYYY-MM-DDTHH:mm:ss');
    console.log(clc.yellow(`[${now}] : ${text}`));
  }
};

exports.always = (text) => {
  const now = moment(Date.now());
  now.tz(process.env.LOG_TIMEZONE);
  now.format('YYYY-MM-DDTHH:mm:ss');
  console.log(clc.green(`[${now}] : ${text}`));
};

exports.error = (text) => {
  const now = moment(Date.now());
  now.tz(process.env.LOG_TIMEZONE);
  now.format('YYYY-MM-DDTHH:mm:ss');
  console.log(clc.red(`[${now}] : ${text}`));
  console.trace();
};
