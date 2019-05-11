const openConection = () => {
  return openDatabase('myShoppingdb', '1.0', 'db app compras', 2 * 1024 * 1024)
  // return window.sqlitePlugin.openDatabase({
  //   name: 'myShopping.db',
  //   location: 'default'
  // })
}

const createDB = () => {
  let sql = 'CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY DESC, name VARCHAR(100) UNIQUE)'
  // let sql = 'DROP TABLE IF EXISTS products'
  let db = openConection()
  db.transaction(function (tx) {
    tx.executeSql(sql)
  }, function (error) {
    // alert(`Transaction ERROR: ${error.message}`)
    return 'Transaction ERROR: ' + error.message
  }, function () {
    // alert('Banco Criado com sucesso!')
    return 'Banco Criado com sucesso!'
  })
}

const read = ({ commit }) => {
  return new Promise((resolve, reject) => {
    let data = []
    data['sql'] = 'SELECT * FROM products'
    data['array'] = []
    var db = openConection()
    db.transaction(function (tx) {
      tx.executeSql(data['sql'], data['array'], function (tx, results) { // Successo
        console.log('read: ' + JSON.stringify(results.rows))
        resolve(results)
      }, function (tx, error) { // Erros
        reject(error)
      })
    }, function (error) {
      alert('error : ' + error.message)
    })
  })
  // return new Promise((resolve, reject) => {
  //   // alert(JSON.stringify(db))
  //   db.transaction(function (tx) {
  //     tx.executeSql('SELECT * FROM products', data['array'], function (tx, results) { // Successo
  //       // alert(JSON.stringify(results))
  //       resolve(results.rows)
  //     }, function (tx, error) { // Erros
  //       reject(error)
  //     })
  //   })
  // })
}

const readOne = ({ commit }, { params }) => {
  let data = []
  data['sql'] = 'SELECT * FROM products WHERE id = ?'
  data['array'] = [params.id]
  // console.log('paramsreone', data['array'])
  return new Promise((resolve, reject) => {
    var db = openConection()
    // alert(db)
    db.transaction(function (tx) {
      tx.executeSql(data['sql'], data['array'], function (tx, results) { // Successo
        resolve(results.rows)
      }, function (tx, error) { // Erros
        reject(error)
      })
    })
  })
}

const create = ({ commit }, params) => {
  let data = []
  data['sql'] = `INSERT INTO products (name) VALUES (?)`
  data['array'] = params
  return new Promise((resolve, reject) => {
    var db = openConection()
    db.transaction(function (tx) {
      tx.executeSql(data['sql'], data['array'], function (tx, results) { // Successo
        console.log('add: ', JSON.stringify(results))
        resolve(results.rows)
      }, function (tx, error) { // Erros
        reject(error)
      })
    })
  })
}

const update = ({ commit }, params) => {
  console.log('params1', params)
  let data = []
  data['sql'] = `UPDATE products SET name = ? WHERE id = ?`
  data['array'] = [params.name, params.id]
  console.log('params', data['array'])
  var db = openConection()
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql(data['sql'], data['array'], function (tx, results) { // Successo
        resolve(results.rows)
      }, function (tx, error) { // Erros
        reject(error)
      })
    })
  })
}

const destroy = ({ commit }, params) => {
  console.log('params1', params)
  let data = []
  data['sql'] = `DELETE FROM products WHERE id = ?`
  data['array'] = params.id
  var db = openConection()
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql(data['sql'], data['array'], function (tx, results) { // Successo
        resolve(results)
      }, function (tx, error) { // Erros
        reject(error)
      })
    })
  })
}

const promessQuery = (sql) => {
  alert('sql ' + JSON.stringify(sql))
  var db = openConection()
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql(sql, [], function (tx, results) { // Successo
        resolve(results)
      }, function (tx, error) { // Erros
        reject(error)
      })
    })
  })
}

const prepareStatement = (data) => {
  console.log(data['sql'], data['array'])
  var db = openConection() // openDatabase('myShoppingdb', '1.0', 'db app compras', 2 * 1024 * 1024)
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql(data['sql'], data['array'], function (tx, results) { // Successo
        resolve(results)
      }, function (tx, error) { // Erros
        reject(error)
      })
    })
  })
}

export {
  openConection,
  createDB,
  create,
  read,
  readOne,
  update,
  destroy,
  promessQuery,
  prepareStatement
}
