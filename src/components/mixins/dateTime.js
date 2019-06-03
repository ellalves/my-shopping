import moment from 'moment'
export const dateTime = {
  methods: {
    formatDateTime (dateTime) {
      return moment(dateTime).format('DD/MM/YYYY HH:mm')
    },

    formatDate (date) {
      return moment(date).format('DD/MM/YYYY')
    },

    formatTime (date) {
      return moment(date).format('HH:mm')
    }
  }
}
