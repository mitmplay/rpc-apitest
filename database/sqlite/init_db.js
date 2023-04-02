module.exports = async () => {
  const {
    _db_,
    _obj_: {HOME},
    _lib_: {fs,c},
  } = global.RPC

  const home = `${HOME}/user-rpc`
  const filename = `${home}/logs.sqlite`

  try {
    await fs.ensureDir(home)
    console.log(c.yellow(`User-rpc Path: ${home}`))
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  global.sql = global.knex(
  {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {filename},
  });

  _db_.logs = sql

  function request(t) {
    t.increments('id').primary()
    t.string    ('dns',  100)
    t.string    ('name', 200)
    t.text      ('template' )
    t.text      ('generate' )
    t.text      ('notes'    )
    t.timestamp ('created'  ).notNull()
    t.timestamp ('updated'  ).notNull()
  }

  function apilog(t) {
    t.increments('id').primary()
    t.string    ('dns',  100)
    t.string    ('api',  200)
    t.string    ('act',  200)
    t.string    ('rspcode',3)
    t.text      ('request'  )
    t.text      ('resp_hdr' )
    t.text      ('response' )
    t.text      ('notes'    )
    t.string    ('x_tag', 99)
    t.timestamp ('created'  ).notNull()
    t.timestamp ('updated'  ).notNull()
    t.integer   ('elapsed'  )
  }

  let ok = await sql.schema.hasTable('request')
  !ok && await sql.schema.createTable('request', request)

  ok = await sql.schema.hasTable('api_log')
  !ok && await sql.schema.createTable('api_log', apilog)

  let rows = await sql('api_log').select('*')
  if (!rows.length) {
    const ts = Date.now()
    await sql('api_log').insert({
      dns:     '::1',
      api:     'greetings',
      act:     '0.hello-world!',
      rspcode: '200',
      request: '{request: 0}',
      response:'{response: 1}',
      notes:   'Sample notes',
      x_tag:   '12345_67890',
      created: ts,
      updated: ts,
      elapsed: 0
    })
    rows = await sql('api_log').select('*')
  }
  console.log(c.yellow(`logs row: ${rows.length}\n`))
}
