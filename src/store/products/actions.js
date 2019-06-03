import { CREATE, READ, UPDATE, DELETE } from '../../components/database/sqlite'

const read = ({ commit }, obj) => {
  let data = READ(obj)
  commit('LOAD_PRODUCTS', data)
  return data
}

const readOne = ({ commit }, params) => {
  let data = READ(params)
  commit('LOAD_PRODUCT', data)
  return data
}

const create = ({ commit }, params) => {
  let data = CREATE(params)
  return data
}

const update = ({ commit }, params) => {
  // alert('params1 ' + JSON.stringify(params))
  let data = UPDATE(params)
  return data
}

const destroy = ({ commit }, params) => {
  let data = DELETE(params)
  return data
}

export {
  create,
  read,
  readOne,
  update,
  destroy
}
