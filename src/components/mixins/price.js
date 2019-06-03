export const price = {
  methods: {
    formatPrice (value, cif = '') {
      let val = (value / 1).toFixed(2).replace('.', ',')
      return cif + ' ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },

    formatPriceDB (value, cif = '') {
      let val = (value / 1).toFixed(2).replace(',', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
  }
}
