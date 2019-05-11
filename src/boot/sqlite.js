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
