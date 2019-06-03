const LOAD_PRODUCT = (state, data) => {
  state.product = data
}

const LOAD_PRODUCTS = (state, data) => {
  state.products = data
}

export {
  LOAD_PRODUCT,
  LOAD_PRODUCTS
}
