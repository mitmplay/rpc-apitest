const connect = function({
    host: connectString,
    user, 
    // schema, 
    // database, 
    password,
}) {
  const c = {
    client: 'oracledb',
    connection: {
      connectString,
      user,
      // schema,
      // database,
      password,
    }
  }
  return global.knex(c)
}
module.exports = connect
