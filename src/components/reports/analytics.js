import { uid } from 'quasar'
import axios from 'axios'

export default {

  logEvent (category, action, label, value) {
    if (navigator.onLine === 'online') {
      axios.get('https://www.google-analytics.com/collect', {
        params: {
          v: 1,
          tid: '142191033',
          ds: 'app', // Se este é um site, use 'website'
          t: 'event',
          cid: this.getCid(),
          ec: category,
          ea: action,
          el: label,
          ev: value,
          an: 'Minhas Compras', // Se não for fornecido, esse evento não será mostrado na visualização em tempo real
          aid: 'br.com.webxpertise.minhascompras.app',
          av: 'v1.0'
        }
      })
    }
  },

  logPage (path, name) {
    if (navigator.onLine === 'online') {
      axios.get('https://www.google-analytics.com/collect', {
        params: {
          v: 1,
          tid: '142191033',
          ds: 'app',
          t: 'pageview',
          cid: this.getCid(),
          dl: path,
          an: 'Minhas Compras', // Se não for fornecido, esse evento não será mostrado na visualização em tempo real
          aid: 'br.com.webxpertise.minhascompras.app',
          av: 'v1.0'
        }
      })
    }
  },

  getCid () {
    // We need an unique identifier for this session
    // We store it in a localStorage, but you may use cookies, too
    if (navigator.onLine === 'online') {
      if (!localStorage.cid) {
        localStorage.cid = uid()
      }
      return localStorage.cid
    }
  }
}
