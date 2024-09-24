const fn  = require('../../_rpc_')

module.exports = async () => {
  const {
    _db_,
    _obj_: {HOME, argv},
    _lib_: {fs,c},
  } = fn()

  const home = argv.rpcpath || `${HOME}/user-rpc`
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
    t.string    ('host', 100)
    t.string    ('name', 200)
    t.string    ('path',  65)
    t.text      ('template' )
    t.text      ('generate' )
    t.text      ('notes'    )
    t.timestamp ('created'  ).notNull()
    t.timestamp ('updated'  ).notNull()
  }

  function apilog(t) {
    t.increments('id').primary()
    t.string    ('host',  100)
    t.string    ('api',  200)
    t.string    ('act',  200)
    t.string    ('path',  65)
    t.string    ('rspcode',3)
    t.text      ('request'  )
    t.text      ('resp_hdr' )
    t.text      ('response' )
    t.text      ('validate' )
    t.integer   ('invalid'  ) //# 0: valid 1:invalid-before 2: invalid-after 3: both
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
      host:    'localhost',
      api:     'greetings',
      act:     '0.hello-world!',
      rspcode: '200',
      request: '{request: 0}',
      response:'{response: 1}',
      resp_hdr: '{}',
      validate: '{}',
      invalid: 0,
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
