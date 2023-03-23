global.knex = require('knex')
const initSqlite = require('./sqlite')

module.exports = fn => {
  console.log('INIT DBs')
  global.mysqldb  = require('./mysqldb')
  global.oracledb = require('./oracledb')
  initSqlite()
  fn()  
}

/*
global.mysqldb({
  host    : 'sl73payiddbq001',
  user    : 'app_QAINT_ALVLT_SRVR',
  database: 'database_QAINT_ALVLT',
  password: 'magVMEDEV1!',
})

global.oracledb({
  host    : 'sl73commdb7d-scan',
  user    : 'VBOX484_RECEIVE_SRVR',
  schema  : 'VBOX484_RECEIVE',
  database: 'VBOX484_RECEIVE',
  password: 'magVMEDEV1!',
})
*/