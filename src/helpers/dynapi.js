const sql = require('mssql');

const getUserData = (pgPool, username) => new Promise((resolve, reject) => {
  const sqlcmd = 'SELECT * FROM bufapi_user WHERE username = $1';
  const params = [username];
  pgPool.connect().then((client) => client
    .query(sqlcmd, params)
    .then((response) => {
      client.release();
      response.rows[0].password = '*****';
      resolve(response.rows[0]);
    })
    .catch((err) => {
      client.release();
      reject(err);
    }));
});

const checkEndpointPerm = (pgPool, userid, endpointid) => new Promise((resolve, reject) => {
  const sqlcmd = 'SELECT COUNT(*) FROM bufapi_endpoint_perm WHERE userid = $1 AND endpointid = $2';
  const params = [userid, endpointid];
  pgPool.connect().then((client) => client
    .query(sqlcmd, params)
    .then((response) => {
      client.release();
      resolve(response.rows[0]);
    })
    .catch((err) => {
      client.release();
      reject(err);
    }));
});

const getEndpointData = (pgPool, endpointid) => new Promise((resolve, reject) => {
  const sqlcmd = 'SELECT * FROM bufapi_endpoint WHERE endpointid = $1';
  const params = [endpointid];
  pgPool.connect().then((client) => client
    .query(sqlcmd, params)
    .then((response) => {
      client.release();
      resolve(response.rows[0]);
    })
    .catch((err) => {
      client.release();
      reject(err);
    }));
});

const getEndpointConnectionData = (pgPool, endpointid) => new Promise((resolve, reject) => {
  const sqlcmd = 'SELECT * FROM bufapi_endpoint_conn WHERE endpointid = $1';
  const params = [endpointid];
  pgPool.connect().then((client) => client
    .query(sqlcmd, params)
    .then((response) => {
      client.release();
      resolve(response.rows[0]);
    })
    .catch((err) => {
      client.release();
      reject(err);
    }));
});

const parseConnection = (connObj) => {
  const connCfg = {
    user: connObj.dbuser,
    password: connObj.dbpassword,
    database: connObj.dbname,
    server: connObj.dbhost,
    port: connObj.dbport,
  };
  // Add options to config
  const connOptions = {};
  for (let n = 1; n < 11; n += 1) {
    const optionName = `option${n}`;
    const optionValue = connObj[optionName];
    if (optionValue == null) {
      continue;
    }
    const opt = optionValue.split(':');
    if ((opt[1].toLowerCase() === 'false') || (opt[1].toLowerCase() === 'true')) {
      connOptions[opt[0]] = Boolean(opt[1]);
    } else {
      connOptions[opt[0]] = opt[1];
    }
  }
  connCfg.options = connOptions;
  return connCfg;
};

const executeQuery = (connectionConfig, query) => new Promise((resolve, reject) => {
  // console.log(connectionConfig);
  // console.log(query);
  sql.connect(connectionConfig, (err) => {
    if (err) {
      reject(err);
    }
    // const request = new sql.request();
    sql.query(query, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
});

const executeDynQuery = async (pgPool, username, endpointid) => {
  try {
    const userObj = await getUserData(pgPool, username);
    const perm = await checkEndpointPerm(pgPool, userObj.userid, endpointid);
    if (parseInt(perm.count, 10) === 0) {
      throw new Error('No permission');
    }
    const endpointObj = await getEndpointData(pgPool, endpointid);
    const endpointConnObj = await getEndpointConnectionData(pgPool, endpointid);
    const connectionConfig = parseConnection(endpointConnObj);
    const result = await executeQuery(connectionConfig, endpointObj.endpointquery);
    return result.recordset;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  executeDynQuery,
};

// sql.connect(config, err => {
//     // ... error checks
//
//     const request = new sql.Request()
//     request.stream = true // You can set streaming differently for each request
//     request.query('select * from verylargetable') // or request.execute(procedure)
//
//     request.on('recordset', columns => {
//         // Emitted once for each recordset in a query
//     })
//
//     request.on('row', row => {
//         // Emitted for each row in a recordset
//     })
//
//     request.on('rowsaffected', rowCount => {
//         // Emitted for each `INSERT`, `UPDATE` or `DELETE` statement
//         // Requires NOCOUNT to be OFF (default)
//     })
//
//     request.on('error', err => {
//         // May be emitted multiple times
//     })
//
//     request.on('done', result => {
//         // Always emitted as the last one
//     })
// })
//
// sql.on('error', err => {
//     // ... error handler
// })
