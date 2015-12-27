describe('lovefield', function() {
  it('should work', function(done) {
    var schemaBuilder = lf.schema.create('todo', 1);
    schemaBuilder.createTable('Item')
      .addColumn('id', lf.Type.INTEGER)
      .addColumn('description', lf.Type.STRING)
      .addPrimaryKey(['id']);

    var todoDb;
    var itemTable;
    schemaBuilder.connect().then(function(db) {
      todoDb = db;
      itemTable = db.getSchema().table('Item');
      var row1 = itemTable.createRow({
        id: 1,
        description: 'hello there'
      });
      var row2 = itemTable.createRow({
        id: 2,
        description: 'omg'
      });

      return db.insertOrReplace().into(itemTable).values([row1, row2]).exec();
    }).then(function() {
      return todoDb.select().from(itemTable).exec();
    }).then(function(rows) {
      rows.forEach(function(row) {
        console.log(row);
      });
      expect(rows.length).toBe(2);
    }).then(done, done);
  });
});
