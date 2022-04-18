module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-console': 'off',
    camelcase: 'off',
    'linebreak-style': 'off',
    'consistent-return': 'off',
    'no-continue': 'off',
  },
};
