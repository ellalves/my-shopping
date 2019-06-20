const LOAD_MARKET = (state, data) => {
  state.product = data
}

const LOAD_MARKETS = (state, data) => {
  state.products = data
}

export {
  LOAD_MARKET,
  LOAD_MARKETS
}
