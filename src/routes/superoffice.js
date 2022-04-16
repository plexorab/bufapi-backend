const log = require('../helpers/log');

module.exports = async (app, pool) => {
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //* Get all warehouses
  //* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  app.get('/api/superoffice/v1/list', (req, res) => {
    const sqlcmd = 'SELECT * FROM dbo.tblSuperoffice';
    pool.connect()
      .then(() => {
        const request = pool.request();
        request.query(sqlcmd)
          .then((data) => {
            res.status(200).send({
              success: true,
              data: data.recordset,
              message: 'OK',
            });
          })
          .catch((error) => {
            log.error(error);
            res.status(200).send({
              success: false,
              data: '',
              message: error,
            });
          });
      })
      .catch((error) => {
        log.error(error);
        res.status(200).send({
          success: false,
          data: '',
          message: error,
        });
      });
  });
};
