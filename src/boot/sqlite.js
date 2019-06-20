var sqlite = openDatabase('myShoppingdb', '1.0', 'db app compras', 2 * 1024 * 1024)
// var sqlite = window.sqlitePlugin.openDatabase({
//   name: 'myShopping.db',
//   location: 'default'
// })
export default async ({
  Vue
}) => {
  Vue.prototype.$sqlite = sqlite
}

let sql = [
  'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY ASC, name VARCHAR(100), username VARCHAR(30) UNIQUE, email VARCHAR(80) UNIQUE, password VARCHAR(200) NOT NULL, sex VARCHAR(20) DEFAULT 0, birth DATE, phone VARCHAR(15), image BLOB, role_id INTEGER, created TEXT, modified TEXT)',
  // 'CREATE TABLE IF NOT EXISTS roles(id INTEGER PRIMARY KEY ASC, name VARCHAR(100), created TEXT, modified TEXT)',
  'CREATE TABLE IF NOT EXISTS markets(id INTEGER PRIMARY KEY ASC, name VARCHAR(100) UNIQUE, image BLOB, user_id INTEGER, created TEXT, modified TEXT)',
  'CREATE TABLE IF NOT EXISTS marks(id INTEGER PRIMARY KEY ASC, name VARCHAR(100) UNIQUE, image BLOB, user_id INTEGER, created TEXT, modified TEXT)',
  'CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY ASC, name VARCHAR(100), image BLOB, mark_id INTEGER, user_id INTEGER, created TEXT, modified TEXT)',
  'CREATE TABLE IF NOT EXISTS lists(id INTEGER PRIMARY KEY ASC, name VARCHAR(100) UNIQUE, user_id INTEGER, created TEXT, modified TEXT)',
  'CREATE TABLE IF NOT EXISTS list_items(id INTEGER PRIMARY KEY ASC, list_id INTEGER NOT NULL, market_id INTEGER NOT NULL, product_id INTEGER NOT NULL, quantity INTEGER NOT NULL, price REAL(10,2) DEFAULT 0.0, user_id INTEGER NOT NULL)'
]
// let sql = ['DROP TABLE IF EXISTS products']
// let sql = ['DROP DATABASE myShoppingdb']
// alert('SQL: ' + sql)
sqlite.transaction(function (tx) {
  for (let line in sql) {
    tx.executeSql(sql[line])
  }
}, function (error) {
  // alert(`Transaction ERROR: ${error.message}`)
  return 'Transaction ERROR: ' + error.message
}, function () {
  // alert('Banco Criado com sucesso!')
  return 'Banco Criado com sucesso!'
})
