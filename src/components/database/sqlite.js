import Vue from 'vue'

/**
 * Insere dados no banco
 *
 * @param  {Object} obj
 * @return {promess}
 */
const CREATE = (obj) => {
  var data = []
  var values = []
  for (let i = -1; i <= obj.fields.length; i++) { // Faz um loop pelo array
    values.push('?') // concatena as instruções
  }
  data['sql'] = `INSERT INTO ${obj.table} (${obj.fields.join(',')}) VALUES (${values.join(',')})`
  data['values'] = obj.values
  return QUERY(data)
}

/**
 * Recebe um ob jeto de arrays e devolve uma promise
 *
 * @param  {Object} obj
 * @return {promess}
 */
const READ = (obj) => {
  var data = []
  let join = null
  let where = null
  if (obj.hasOwnProperty('conditions')) {
    let query = []
    // Verifica o tipo de consulta
    switch (obj.conditions) {
      case 'where':
        obj.fields.forEach(function (item, indice, array) { // Faz um loop pelo array
          query.push(array[indice] + ' = ?') // concatena as instruções
        })
        where = query.length > 0 ? query.join(' && ') : '' // Se tem algum item concatena
        data['values'] = [obj.values] // Valores da consulta
        break

      case 'orWhere':
        obj.fields.forEach(function (item, indice, array) {
          query.push(array[indice] + ' = ?')
        })
        where = query.length > 0 ? query.join(' || ') : ''
        data['values'] = [obj.values]
        break

      case 'like':
      case 'likeRight':
      case 'likeLeft':
        obj.fields.forEach(function (item, indice, array) {
          query.push(array[indice] + ` LIKE ?`)
        })

        if (obj.conditions === 'likeRight') {
          data['values'] = [obj.values + '%']
        } else if (obj.conditions === 'likeLeft') {
          data['values'] = ['%' + obj.values]
        } else {
          data['values'] = ['%' + obj.values + '%']
        }
        break
      default:
        data['values'] = obj.values
    }
  }

  // Verifica se está usando JOIN
  if (obj.join) {
    join = []
    obj.join.forEach((item, indice, array) => {
      join.push(`${item.table} ON ${item.on}`)
    })
  }

  // Verifica quais campos foram selecionados
  let select = obj.select.length > 0 ? obj.select : '*'

  data['sql'] = `SELECT ${select} FROM ${obj.table} ${join ? 'JOIN ' + join : ''} ${where ? 'WHERE ' + where : ''}` // Cria a instrução
  return QUERY(data)
}

/**
 * Atualizar registro
 * @param {Object} obj - objeto
 * @return {promess} - QUERY
 */
const UPDATE = (obj) => {
  var data = []
  var values = []
  var query = []
  var queryObj, queryKeys = []
  for (let item in obj.fields) {
    values[item] = obj.fields[item] + ' = ?'
  }

  obj.conditions.forEach(function (item, indice, array) { // Faz um loop pelo array
    queryObj = Object.values(array[indice])
    queryKeys = Object.keys(array[indice])
    queryKeys.forEach((item, indice, array) => {
      query.push(item + ' = ?')
    })
  })
  let array = obj.values.concat(queryObj) // associa os arrays
  let where = query.length > 0 ? query.join(' && ') : '' // Se tem algum item concatena
  data['values'] = [obj.values] // Valores da consulta
  data['sql'] = `UPDATE ${obj.table} SET ${values.join(', ')} ${where ? 'WHERE ' + where : ''}`

  // data['sql'] = `INSERT INTO ${obj.table} (${obj.fields.join(',')}) VALUES (${values.join(',')})`
  data['values'] = array
  return QUERY(data)
}

const DELETE = (obj) => {
  var data = []
  var queryObj, queryKeys, query = []
  obj.conditions.forEach(function (item, indice, array) { // Faz um loop pelo array
    queryObj = Object.values(array[indice])
    queryKeys = Object.keys(array[indice])
    queryKeys.forEach((item, indice, array) => {
      query.push(item + ' = ?')
    })
  })
  let where = query.length > 0 ? query.join(' && ') : '' // Se tem algum item concatena
  data['sql'] = `DELETE FROM ${obj.table} ${where ? 'WHERE ' + where : ''}`
  data['values'] = queryObj
  return QUERY(data)
}

const QUERY = (data) => {
  return new Promise((resolve, reject) => {
    Vue.prototype.$sqlite.transaction(function (tx) {
      tx.executeSql(data['sql'], data['values'], function (tx, results) { // Successo
        resolve(results.rows)
      }, function (tx, error) { // Erros
        reject(error)
      })
    },
    function (error) {
      // alert(`Transaction ERROR: ${error.message}`)
      return 'Transaction ERROR: ' + error.message
    })
  })
}

export {
  CREATE,
  READ,
  UPDATE,
  DELETE,
  QUERY
}
