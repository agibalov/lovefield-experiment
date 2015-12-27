describe('lovefield', () => {
  var db
  var itemTable
  beforeEach(async (done) => {
    var schemaBuilder = lf.schema.create('todo', 1)
    schemaBuilder.createTable('Item')
      .addColumn('id', lf.Type.INTEGER)
      .addColumn('description', lf.Type.STRING)
      .addPrimaryKey(['id'])

    db = await schemaBuilder.connect()
    itemTable = db.getSchema().table('Item')

    done()
  })

  it('should let me insert rows', async (done) => {
    var row = itemTable.createRow({
      id: 1,
      description: 'hello there'
    })

    var rows = await db.insertOrReplace().into(itemTable).values([row]).exec()
    expect(rows.length).toBe(1)

    done()
  })

  describe('when there are rows', () => {
    beforeEach(async (done) => {
      await db.insertOrReplace().into(itemTable).values([
        itemTable.createRow({ id: 1, description: 'note one' }),
        itemTable.createRow({ id: 2, description: 'note two' })
      ]).exec()

      done()
    })

    it('should let me select all', async (done) => {
      var rows = await db.select().from(itemTable).exec()
      expect(rows.length).toBe(2)

      done()
    })

    it('should let me select by id', async (done) => {
      var rows = await db.select().from(itemTable).where(itemTable.id.eq(2)).exec()
      expect(rows.length).toBe(1)
      expect(rows[0].description).toBe('note two')

      done()
    })
  })
})
