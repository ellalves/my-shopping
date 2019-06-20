import Vue from 'vue'

const readSelect = ({ commit }, params) => {
  let data = []
  data['sql'] = `SELECT * FROM marks WHERE name LIKE '%${params.name}%'`
  data['array'] = []
  return new Promise((resolve, reject) => {
    let db = Vue.prototype.$sqlite
    db.transaction(function (tx) {
      tx.executeSql(data['sql'], data['array'], function (tx, results) { // Successo
        resolve(results)
      }, function (tx, error) { // Erros
        reject(error)
      })
    }, function (error) {
      reject(error)
    })
  })
}
const read = ({ commit }, obj) => {
  let data = []
  // limit: [limit, offset]
  if (obj.hasOwnProperty('limit') && obj.limit.length > 0) {
    var limit = obj.limit.length === 1 ? obj.limit[0] : obj.limit.join(',')
  }
  data['sql'] = `SELECT * FROM marks ${limit ? 'LIMIT ' + limit : ''}`
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

const readOne = ({ commit }, params) => {
  let data = []
  data['sql'] = 'SELECT * FROM marks WHERE id = ?'
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

const create = ({ commit }, params) => {
  let data = []
  data['sql'] = `INSERT INTO marks (name, image, user_id) VALUES (?,?,?)`
  data['array'] = [params.name, params.image, params.user_id]
  return new Promise((resolve, reject) => {
    let db = Vue.prototype.$sqlite
    db.transaction(function (tx) {
      tx.executeSql(data['sql'], data['array'], function (tx, results) { // Successo
        resolve(results.rows)
      }, function (tx, error) { // Erros
        reject(error)
      })
    })
  })
}

const update = ({ commit }, params) => {
  let data = []
  data['sql'] = `UPDATE marks SET name = ?, image = ? WHERE id = ?`
  data['array'] = [params.name, params.image, params.id]
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

const destroy = ({ commit }, params) => {
  let data = []
  data['sql'] = `DELETE FROM marks WHERE id = ?`
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

const promessQuery = (sql, params) => {
  alert('sql ' + JSON.stringify(sql))
  let db = Vue.prototype.$sqlite
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql(sql, params, function (tx, results) { // Successo
        resolve(results)
      }, function (tx, error) { // Erros
        reject(error)
      })
    })
  })
}

const prepareStatement = (data) => {
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
  readSelect,
  read,
  readOne,
  update,
  destroy,
  promessQuery,
  prepareStatement
}
