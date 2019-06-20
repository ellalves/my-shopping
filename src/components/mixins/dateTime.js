import moment from 'moment'
export const dateTime = {
  methods: {
    formatDateTime (dateTime) {
      return moment(dateTime).format('DD/MM/YYYY HH:mm')
    },

    formatDateTimeDb (dateTime) {
      return moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
    },

    formatDate (date) {
      return moment(date).format('DD/MM/YYYY')
    },

    formatDateDb (date) {
      return moment(date).format('YYYY-DD-MM')
    },

    formatTime (date) {
      return moment(date).format('HH:mm')
    }
  }
}
