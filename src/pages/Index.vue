<template>
  <q-page class='flex flex-center'>
    <img alt='Quasar logo' src='~assets/mc-transparent.png'>
    <q-page-scroller position='bottom-right'>
      <q-btn fab icon='keyboard_arrow_up' color='accent' />
    </q-page-scroller>
  </q-page>
</template>

<style>
</style>

<script>
// import { mapActions } from 'vuex'
var wentOffline, wentOnline
function handleConnectionChange (event) {
  if (event.type === 'offline') {
    console.log('Você perdeu a conexão.')
    wentOffline = new Date(event.timeStamp)
  }
  if (event.type === 'online') {
    console.log('Você está agora de volta online.')
    wentOnline = new Date(event.timeStamp)
    console.log('Você estava off-line para ' + (wentOnline - wentOffline) / 1000 + ' segundos')
  }
  console.log(new Date(event.timeStamp))
}
window.addEventListener('online', handleConnectionChange)
window.addEventListener('offline', handleConnectionChange)

export default {
  name: 'PageIndex',

  created () {
    // this.loaded()
  },

  data () {
    return {
      // db: null,
    }
  },

  computed: {
  },

  methods: {
    // loaded () {
    //   if (navigator.onLine) {
    //     console.log('online')
    //   } else {
    //     console.log('offline')
    //   }
    // }
  }
}
</script>
