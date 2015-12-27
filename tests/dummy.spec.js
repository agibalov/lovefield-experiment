describe('lovefield', () => {
  it('should work #2', async (done) => {
    var schemaBuilder = lf.schema.create('todo', 1)
    schemaBuilder.createTable('Item')
      .addColumn('id', lf.Type.INTEGER)
      .addColumn('description', lf.Type.STRING)
      .addPrimaryKey(['id'])

    var db = await schemaBuilder.connect()
    var itemTable = db.getSchema().table('Item')
    var row1 = itemTable.createRow({
      id: 1,
      description: 'hello there'
    })
    var row2 = itemTable.createRow({
      id: 2,
      description: 'omg'
    })

    await db.insertOrReplace().into(itemTable).values([row1, row2]).exec()
    var rows = await db.select().from(itemTable).exec()
    rows.forEach(console.log)
    expect(rows.length).toBe(2)

    done()
  })
})
