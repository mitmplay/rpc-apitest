global.knex = require('knex')
const {initSqlite} = require('./sqlite')

module.exports = fn => {
  console.log('INIT DBs')
  global.mysqldb  = require('./mysqldb')
  global.oracledb = require('./oracledb')
  initSqlite()
  fn()  
}
