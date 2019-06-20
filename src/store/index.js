import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import carts from './carts'
import marks from './marks'
import products from './products'
import markets from './markets'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    namespaced: true,
    modules: {
      auth,
      carts,
      marks,
      markets,
      products
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
