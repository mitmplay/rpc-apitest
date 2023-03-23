const connect = function({
  user, 
  password,
  database, 
  host,
}) {
  const c = {
    client: 'mysql2',
    connection: {
      host,
      user,
      database,
      password,
    }
  }
  return global.knex(c)
}
module.exports = connect
