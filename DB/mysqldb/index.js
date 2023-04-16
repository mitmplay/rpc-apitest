const connect = function({host, user, password, database}) {
  return global.knex({
    client: 'mysql2',
    connection: {
      host,
      user,
      password,
      database,
    }
  })
}
module.exports = connect
