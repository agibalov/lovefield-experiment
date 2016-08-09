describe('lovefield', () => {
  var db
  var itemTable
  beforeEach(async (done) => {
    var schemaBuilder = lf.schema.create('todo', 1)
    schemaBuilder.createTable('Item')
      .addColumn('id', lf.Type.INTEGER)
      .addColumn('description', lf.Type.STRING)
      .addPrimaryKey(['id'])

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

  describe('when I have a transaction', () => {
    var tx
    beforeEach(async (done) => {
      tx = db.createTransaction()
      await tx.begin([itemTable])
      await tx.attach(db.insertOrReplace().into(itemTable).values([
        itemTable.createRow({ id: 1, description: 'note one' })
      ]))
      done()
    })

    it('should let me commit it', async (done) => {
      await tx.commit()

      const rows = await db.select(lf.fn.count().as('count')).from(itemTable).exec()
      expect(rows[0].count).toBe(1);

      done()
    })

    it('should let me rollback it', async (done) => {
      await tx.rollback()

      const rows = await db.select(lf.fn.count().as('count')).from(itemTable).exec()
      expect(rows[0].count).toBe(0);

      done()
    })
  })
})
