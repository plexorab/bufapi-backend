const { executeDynQuery } = require('../helpers/dynapi');
// const log = require('../helpers/log');

module.exports = async (app, pool) => {
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //* username : username
  //* endpointid: Endpoint ID
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  app.get('/api/bufapi/v1/dynapi/get', (req, res) => {
    if (!req.query.username) {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'Query parameter username missing',
      });
    }
    if (!req.query.endpointid) {
      return res.status(400).send({
        success: false,
        data: null,
        message: 'Query parameter endpointid missing',
      });
    }
    executeDynQuery(pool, req.query.username, req.query.endpointid)
      .then((resp) => {
        res.status(200).send({
          success: true,
          data: resp,
          message: 'OK',
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(400).send({
          success: false,
          data: null,
          message: err.toString(),
        });
      });
  });
};
