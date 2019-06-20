import {
  CREATE,
  READ,
  UPDATE,
  DELETE
} from '../../components/database/sqlite'
import {
  LocalStorage,
  SessionStorage
} from 'quasar'

const login = ({ commit }, obj) => {
  let data = READ(obj)
  // console.log('login', data)
  return data
}

const logout = ({ commit }) => {
  commit('LOGOUT_USER')
  SessionStorage.remove('AUTH')
  LocalStorage.remove('AUTH')
}

const read = ({ commit }, obj) => {
  let data = READ(obj)
  commit('LOAD_USERS', data)
  return data
}

const readOne = ({ commit }, params) => {
  let data = READ(params)
  commit('LOAD_USER', data)
  return data
}

const create = ({ commit }, params) => {
  console.log('user', params)
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
  login,
  logout,
  create,
  read,
  readOne,
  update,
  destroy
}
