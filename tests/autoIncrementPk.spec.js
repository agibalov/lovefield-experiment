describe('auto-increment pk', () => {
  var db
  var itemTable
  beforeEach(async (done) => {
    var schemaBuilder = lf.schema.create('todo', 1)
    schemaBuilder.createTable('Item')
      .addColumn('id', lf.Type.INTEGER)
      .addColumn('description', lf.Type.STRING)
      .addPrimaryKey(['id'], true)

    db = await schemaBuilder.connect({
      storeType: lf.schema.DataStoreType.MEMORY
    })
    itemTable = db.getSchema().table('Item')

    done()
  })

  afterEach(async (done) => {
    db.close()
    done()
  })

  it('should generate pk automatically', async (done) => {
    var rows = await db.insertOrReplace().into(itemTable).values([
      itemTable.createRow({ description: 'hello there' })
    ]).exec()
    expect(rows[0].id).toBe(1)

    rows = await db.insertOrReplace().into(itemTable).values([
      itemTable.createRow({ description: 'hello there 222' })
    ]).exec()
    expect(rows[0].id).toBe(2)

    done()
  })
})
