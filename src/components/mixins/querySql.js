const querySql = {
  methods: {
    openConection () {
      // Abre a conexão com o banco
      return openDatabase('myShoppingdb', '1.0', 'db app compras', 2 * 1024 * 1024)
    },

    promessQuery (sql) {
      var db = this.openConection()
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(sql, [], function (tx, results) { // Successo
            resolve(results)
          }, function (tx, error) { // Erros
            reject(error)
          })
        })
      })
    },

    prepareStatement (data) {
      var db = this.openConection()
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
  }
}
export {
  querySql
}
