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
      expect(rows[0].count).toBe(1)

      done()
    })

    it('should let me rollback it', async (done) => {
      await tx.rollback()

      const rows = await db.select(lf.fn.count().as('count')).from(itemTable).exec()
      expect(rows[0].count).toBe(0)

      done()
    })
  })

  describe('when I want to observe', () => {
    it('should call my handler only once after commit', async (done) => {
      await db.insertOrReplace().into(itemTable).values([
        itemTable.createRow({ id: 1, description: 'note one' })
      ]).exec()

      const query = db.select().from(itemTable).where(itemTable.id.eq(1))
      const changeHandlerSpy = jasmine.createSpy('changeHandler')
      db.observe(query, changeHandlerSpy)

      const tx = db.createTransaction()
      await tx.begin([itemTable])

      await tx.attach(db.delete().from(itemTable).where(itemTable.id.eq(1)))
      await tx.attach(db.insertOrReplace().into(itemTable).values([
        itemTable.createRow({ id: 1, description: 'updated note one' })
      ]))
      await tx.attach(db.update(itemTable).set(itemTable.description, 'test').where(itemTable.id.eq(1)))

      await tx.commit()

      expect(changeHandlerSpy.calls.count()).toBe(1)
      expect(changeHandlerSpy.calls.argsFor(0)[0]).toEqual([{
        addedCount: 1,
        index: 0,
        object: [{ id: 1, description: 'test' }],
        removed: [],
        type: 'splice'
      }])

      done()
    })
  })
})
