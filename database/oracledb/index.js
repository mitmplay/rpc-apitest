const connect = function({host, user, password}) {
  const connectString = host
  return global.knex({
    client: 'oracledb',
    connection: {
      user,
      password,
      connectString,
    }
  })
}
module.exports = connect
