const LOAD_USER = (state, data) => {
  state.user = data
}

const LOAD_USERS = (state, data) => {
  state.users = data
}

const LOGIN_USER = (state, data) => {
  state.me = data
  state.isAuth = true
  // state.myRoles = data.roles.map((obj) => obj.name)
}

const LOGOUT_USER = (state) => {
  state.me = {}
  state.myRoles = []
  state.isAuth = false
}

export {
  LOGIN_USER,
  LOGOUT_USER,
  LOAD_USER,
  LOAD_USERS
}
