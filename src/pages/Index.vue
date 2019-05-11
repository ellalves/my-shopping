<template>
  <q-page class="flex flex-center">
    <div>IMEI <br> {{IMEI}}</div>
    <img alt="Quasar logo" src="~assets/quasar-logo-full.svg">
  </q-page>
</template>

<style>
</style>

<script>
// import { mapActions } from 'vuex'
export default {
  name: 'PageIndex',

  created () {
    // this.createDB()
    // this.read()
  },

  data () {
    return {
      // db: null,
      IMEI: window.device === void 0 ? 'Espere ... localizando seu dispositivo mobile/tablet' : window.device
    }
  },

  methods: {
    // createDB () {
    //   try {
    //     this.db = openDatabase('myShoppingdb', '1.0', 'db app compras', 2 * 1024 * 1024)
    //     this.db.transaction(function (tx) {
    //       tx.executeSql('CREATE TABLE IF NOT EXISTS tasks (task_id INTEGER PRIMARY KEY ASC, task_name VARCHAR(200))')
    //     })
    //   } catch (err) {
    //     alert('Deu merda na criação do BD')
    //   }
    //   console.log('Banco foi criado e aberto!')
    // },
    // ...mapActions('tasks', ['promessQuery']),
    // create (name) {
    //   this.promessQuery('INSERT INTO tasks(task_value) VALUES (' + name + ')').then((res) => {
    //     console.log('Insert', res)
    //   })
    // },

    // update (id, name) {
    //   this.promessQuery('UPDATE tasks SET task_value = "' + name + '" WHERE task_id = ' + id).then((res) => {
    //     console.log('Insert', res)
    //   })
    // },

    // delete (id, name) {
    //   this.promessQuery('DELETE FROM tasks WHERE task_id = ' + id).then((res) => {
    //     console.log('Insert', res)
    //   })
    // },

    // read () {
    //   this.promessQuery('SELECT * FROM tasks').then((res) => {
    //     console.log('res', res.rows)
    //   })
    // this.db.transaction(function (tx) {
    //   tx.executeSql('SELECT * FROM tasks', [], function (tx, results) {
    //     let len = results.rows.length
    //     let res = []
    //     for (let i = 0; i < len; i++) {
    //       let task = {
    //         id: results.rows.item(i).task_id,
    //         name: results.rows.item(i).task_name
    //       }
    //       res.push(task)
    //       console.log(results.rows.item(i))
    //     }
    //     return res
    //   })
    // })
    // }
  }
}
</script>
