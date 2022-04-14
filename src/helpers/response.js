/* eslint-disable guard-for-in */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */

const capitalizeKeys = (obj) => {
  const isObject = (o) => Object.prototype.toString.apply(o) === '[object Object]';
  const isArray = (o) => Object.prototype.toString.apply(o) === '[object Array]';
  const transformedObj = isArray(obj) ? [] : {};

  for (const key in obj) {
    const transformedKey = key.replace(/^\w/, (c, _) => c.toUpperCase());

    if (isObject(obj[key]) || isArray(obj[key])) {
      transformedObj[transformedKey] = capitalizeKeys(obj[key]);
    } else {
      transformedObj[transformedKey] = obj[key];
    }
  }
  return transformedObj;
};

const lowercaseKeys = (obj) => {
  const isObject = (o) => Object.prototype.toString.apply(o) === '[object Object]';
  const isArray = (o) => Object.prototype.toString.apply(o) === '[object Array]';
  const transformedObj = isArray(obj) ? [] : {};

  for (const key in obj) {
    const transformedKey = key.toLowerCase();

    if (isObject(obj[key]) || isArray(obj[key])) {
      transformedObj[transformedKey] = lowercaseKeys(obj[key]);
    } else {
      transformedObj[transformedKey] = obj[key];
    }
  }
  return transformedObj;
};

const uppercaseKeys = (obj) => {
  const isObject = (o) => Object.prototype.toString.apply(o) === '[object Object]';
  const isArray = (o) => Object.prototype.toString.apply(o) === '[object Array]';
  const transformedObj = isArray(obj) ? [] : {};

  for (const key in obj) {
    const transformedKey = key.toUpperCase();

    if (isObject(obj[key]) || isArray(obj[key])) {
      transformedObj[transformedKey] = uppercaseKeys(obj[key]);
    } else {
      transformedObj[transformedKey] = obj[key];
    }
  }
  return transformedObj;
};

module.exports = {
  capitalizeKeys,
  lowercaseKeys,
  uppercaseKeys,
};
