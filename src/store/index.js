import Vue from 'vue'
import Vuex from 'vuex'

import products from './products'
import marks from './marks'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    namespaced: true,
    modules: {
      products,
      marks
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
