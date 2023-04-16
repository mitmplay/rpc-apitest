const knex = require('knex')

function apilog(t) {
  t.increments('id').primary()
  t.string    ('api',  200)
  t.string    ('act',  200)
  t.string    ('rspcode',3)
  t.text      ('request'  )
  t.text      ('response' )
  t.text      ('notes'    )
  t.string    ('x_tag', 99)
  t.timestamp ('created'  ).notNull()
  t.timestamp ('updated'  ).notNull()
  t.integer   ('elapsed'  )
}

module.exports = async () => {
  const {
    _obj_: {HOME},
    _lib_: {fs,c},
  } = _rpc_

  const home = `${HOME}/user-rpc`
  const filename = `${home}/logs.sqlite`

  try {
    await fs.ensureDir(home)
    console.log(c.yellow(`User-rpc Path: ${home}!`))
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  global.sql = knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {filename},
  });

  const t = 'api_log'
  const exists = await sql.schema.hasTable(t)
  !exists  && await sql.schema.createTable(t, apilog)

  let rows = await sql(t).select('*')
  if (!rows.length) {
    const ts = Date.now()
    await sql(t).insert({
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
    rows = await sql(t).select('*')
  }
  console.log(c.yellow(`logs row: ${rows.length}\n`))
}
