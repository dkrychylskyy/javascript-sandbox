const squel = require("squel");

function selectAll(table, whereString) {
  let query = squel.select()
  .from(table)
  .field('*');
  if (whereString) {
    query = query.where(whereString);
  }
  return query.toString();
}

function selectOne(table, id) {
  return squel.select()
  .from(table)
  .field('*')
  .where("id = ?", id)
  .toString();
}

function selectWhere(table, where, operator) {
  operator = operator || '=';
  let query = squel.select()
  .from(table)
  .field('*');
  for (var key in where) {
    query = query.where(key + ' ' + operator + ' ?', where[key]);
  }
  return query.toString();
}

function deleteWithId(table, id, idKey) {
  idKey = idKey !== undefined ? idKey : 'id';
  return squel.delete()
  .from(table)
  .where(idKey + " = ?", id)
  .toString();
}

function selectIn(table, ids) {
  const where = ids.length === 0 ? '0' :
    "id IN (" + ids.join(',') + ")";
  return squel.select()
  .from(table)
  .field('*')
  .where(where)
  .toString();
}

function selectRelatees(table, relateeKey, relateeId) {
  return squel.select()
  .from(table)
  .field('*')
  .where(relateeKey + " = ?", relateeId)
  .toString();
}

function selectRelateesIn(table, relateeKey, relateeIds) {
  const where = relateeIds.length === 0 ? '0' :
    relateeKey + " IN (" + relateeIds.join(',') + ")";
  return squel.select()
  .from(table)
  .field('*')
  .where(where)
  .toString();
}


// function selectMany(table, ids) {
//   const idsString = ids.join(',');
//   return squel.select()
//   .from(table)
//   .field('*')
//   .where("id IN ?", idsString)
//   .toString();
// }


function getSelectOne(table) {
  return id => {
    return squel.select()
    .from(table)
    .field('*')
    .where("id = ?", id)
    .toString();
  };
}

function getInsert(table) {
  return attributes => {
    attributes = Array.isArray(attributes) ? attributes : [attributes];
    return insert(table, attributes);
  };
}

function insert(table, rows) {
  rows = Array.isArray(rows) ? rows : [rows];
  rows.forEach(row => { delete row.id; });
  return squel.insert({ replaceSingleQuotes: true, autoQuoteFieldNames: true })
  .into(table)
  .setFieldsRows(rows)
  .toString();
}

function updateOne(table, id, attributes) {
  delete attributes.id;
  if(attributes.createdAt) {
    delete attributes.createdAt;
  }
  return squel.update({ replaceSingleQuotes: true, autoQuoteFieldNames: true })
    .table(table)
    .setFields(attributes)
    .where('id = ' + id)
    .toString();
}

function updateWhere(table, where, attributes) {
  delete attributes.id;
  if(attributes.createdAt) {
    delete attributes.createdAt;
  }
  let query = squel.update({ replaceSingleQuotes: true, autoQuoteFieldNames: true })
  .table(table)
  .setFields(attributes);
  for (var key in where) {
    query = query.where(key + ' = ?', where[key]);
  }
  return query.toString();
}

function updateIn(table, ids, attributes) {
  delete attributes.id;
  if(attributes.createdAt) {
    delete attributes.createdAt;
  }
  const where = ids.length === 0 ? '0' :
    "id IN (" + ids.join(',') + ")";
  return squel.update({ replaceSingleQuotes: true, autoQuoteFieldNames: true })
  .table(table)
  .setFields(attributes)
  .where(where)
  .toString();
}


function getUpdateOne(table, id) {
  return attributes => updateOne(table, id, attributes);
}
// describe('squel query', () => {
  
//  it('should build a select query', () => {
//    const sql = 
//     sql.should.equal('SELECT * FROM table');
//  });

//   it('should build an insert query', () => {
//     const sql = create('users', { email: 'bh@localhost.local', order: 1, password: '###bloody#hash', createdAt: '2017-02-27' });
//     lineLogger(sql);
//   });

// });

module.exports = {
  selectAll, selectOne, selectIn, selectWhere, selectRelatees, selectRelateesIn, getSelectOne,
  insert, getInsert,
  updateOne, updateWhere, getUpdateOne, updateIn,
  deleteWithId
};