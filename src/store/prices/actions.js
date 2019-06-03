import Vue from 'vue'

const read = ({
  commit
}) => {
  let data = []
  data['sql'] = 'SELECT p.id, p.name, m.name AS mark FROM products AS p JOIN marks AS m ON mark_id = m.id'
  data['array'] = []
  return new Promise((resolve, reject) => {
    let db = Vue.prototype.$sqlite
    db.transaction(function (tx) {
      tx.executeSql(data['sql'], data['array'], function (tx, results) { // Successo
        commit('LOAD_PRODUCTS', results)
        resolve(results)
      }, function (tx, error) { // Erros
        reject(error)
      })
    }, function (error) {
      alert('error : ' + error.message)
    })
  })
}

const readOne = ({
  commit
}, params) => {
  let data = []
  data['sql'] = 'SELECT * FROM products WHERE id = ?'
  data['array'] = [params.id]
  return new Promise((resolve, reject) => {
    let db = Vue.prototype.$sqlite
    db.transaction(function (tx) {
      tx.executeSql(data['sql'], data['array'], function (tx, results) { // Successo
        commit('LOAD_PRODUCT', results.rows)
        resolve(results.rows)
      }, function (tx, error) { // Erros
        reject(error)
      })
    })
  })
}

const create = ({
  commit
}, params) => {
  let data = []
  data['sql'] = `INSERT INTO products (name, image, mark_id) VALUES (?,?,?)`
  data['array'] = [params.name, params.name, params.mark_id]
  return new Promise((resolve, reject) => {
    let db = Vue.prototype.$sqlite
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

const update = ({
  commit
}, params) => {
  alert('params1 ' + JSON.stringify(params))
  let data = []
  data['sql'] = `UPDATE products SET name = ?, mark_id = ?, image = ? WHERE id = ?`
  data['array'] = [params.name, params.mark_id, params.image, params.id]
  let db = Vue.prototype.$sqlite
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

const destroy = ({
  commit
}, params) => {
  let data = []
  data['sql'] = `DELETE FROM products WHERE id = ?`
  data['array'] = [params.id]
  let db = Vue.prototype.$sqlite
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
  let db = Vue.prototype.$sqlite
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
  let db = Vue.prototype.$sqlite // openDatabase('myShoppingdb', '1.0', 'db app compras', 2 * 1024 * 1024)
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
  create,
  read,
  readOne,
  update,
  destroy,
  promessQuery,
  prepareStatement
}
