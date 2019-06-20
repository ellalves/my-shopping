<template>
  <q-page>
    <q-toolbar class="bg-secondary text-white shadow-2">
      <q-toolbar-title>
        <q-btn flat icon="keyboard_arrow_left" v-go-back.single />
        Lista de mercados
      </q-toolbar-title>
      <q-btn flat left dense label="Novo" icon="add_circle_outline" class="cursor-pointer" @click.native="dialogSave('create', null)" />
    </q-toolbar>
    <q-list bordered separator>
      <q-item clickable v-ripple v-for="market in markets" :key="market.id">
        <q-item-section top avatar>
          <q-avatar rounded>
            <q-img :src="market.image !== null ? market.image : './statics/quasar-logo.png'" :alt="market.image" placeholder-src="./statics/mc-up-transparent.png" />
          </q-avatar>
        </q-item-section>

        <q-item-section @click.native="dialogSave('update', market)">
          <q-item-label>{{market.name}}</q-item-label>
          <q-item-label caption>#ID: {{market.id}}</q-item-label>
          <q-item-label caption>Marca: {{market.mark}}</q-item-label>
          <q-item-label caption>Atualização: {{ formatDateTime(market.created) }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <!--// Save //-->
    <q-dialog v-model="mSave">
      <q-card style="width: 700px max-width: 80vw">
        <q-card-section class="row items-center">
          <div class="text-h6"> {{titleMarket}} </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <take-picture :srcImage="market.image" @takeImage="returnImg"></take-picture>
          <q-form>
            <q-input
              ref="input"
              v-model="market.name"
              label="Nome do mercado *"
              :rules="[
                  val => !!val || '* Não pode ser vazio',
                  val => val.length < 3 || 'Por favor use no minímo 3 caractere',
                ]"
              lazy-rules
            />

            <q-btn icon="save" color="positive" label="Salvar" @click.native="saveMarket()" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md']" />
            <q-btn icon="delete_forever" color="negative" label="Deletar" v-close-popup @click.native="mDelete = true" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md']" v-if="this.type == 'update'" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!--// Delete confirm //-->
    <q-dialog v-model="mDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Deletar registro: {{this.market.name}}</div>
        </q-card-section>
        <q-card-section class="row items-center">
          <q-avatar icon="delete_outline" color="negative" text-color="white" />
          <span class="q-ml-sm">Essa ação não pode ser desfeita!</span>
        </q-card-section>

        <q-card-actions class="float-right">
          <q-btn flat label="Não" color="info" v-close-popup />
          <q-btn flat label="Sim" color="negative" @click.native="deletarMarket" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { price } from '../../components/mixins/price'
import { dateTime } from '../../components/mixins/dateTime'
import TakePicture from '../../components/global/TakePicture'

export default {
  name: 'listMarkets',

  created () {
    this.listMarkets()
  },

  data () {
    return {
      options: [],
      mark: {},
      stringOptions: [],
      titleMarket: 'Adicionar produto',
      sourceType: 'CAMERA',
      type: 'add',
      mSave: false,
      mDelete: false,
      market: {
        id: null,
        name: '',
        image: null,
        user_id: 1,
        created: null
      },
      errors: [],
      markets: {},
      total: 0.0
    }
  },

  computed: {
    ...mapState('auth', ['me'])
  },

  methods: {
    ...mapActions('markets', ['createDB', 'read', 'select', 'readOne', 'create', 'update', 'destroy']),
    ...mapActions('marks', {
      lsts: 'read',
      readSelect: 'readSelect'
    }),

    dialogSave (type, market) {
      this.mSave = true
      this.type = type
      this.market = {}
      this.market.user_id = this.me.id
      this.listMarkets('')
      if (type === 'update') {
        this.titleMarket = 'Alterar mercado'
        let obj = {
          table: 'markets',
          fields: ['id'],
          values: [market.id],
          conditions: 'where'
        }
        this.readOne(obj).then((res) => {
          this.market = res.item(0)
          this.mark = { // Formata os dados para o select
            label: this.market.mark,
            value: this.market.mark_id,
            icon: null
          }
        }).catch(() => {
          this.$q.notify({
            message: 'Oooops! Ocorreu um erro inesperado.',
            color: 'red-10',
            position: 'center',
            icon: 'error_outline',
            timeout: Math.random() * 5000 + 3000
          })
        })
      }
    },

    saveMarket () {
      if (this.type === 'update') {
        let obj = {
          table: 'markets',
          fields: ['name', 'image', 'user_id', 'modified'],
          values: [this.market.name, this.market.image, this.market_id, this.formatDateTimeDb(new Date())],
          conditions: [{ id: this.market.id }]
        }
        this.update(obj).then(() => {
          this.$q.notify({
            message: 'Supermercado atualizado com sucesso!',
            color: 'green-10',
            position: 'center',
            icon: 'done_outline',
            timeout: Math.random() * 1500
          })
        }).catch(() => {
          this.$q.notify({
            message: 'Oooops! Ocorreu um erro inesperado.',
            color: 'red-10',
            position: 'center',
            icon: 'error_outline',
            timeout: Math.random() * 5000 + 3000
          })
        })
      } else {
        let obj = {
          table: 'markets',
          fields: ['name', 'image', 'user_id', 'created'],
          values: [this.market.name, this.market.image, this.market.user_id, this.formatDateTimeDb(new Date())]
        }
        this.create(obj).then((res) => {
          console.log(res)
          this.$q.notify({
            message: 'Supermercado adicionado com sucesso!',
            color: 'green-10',
            position: 'center',
            icon: 'done_outline',
            timeout: Math.random() * 1500
          })
        }).catch(() => {
          this.$q.notify({
            message: 'Oooops! Ocorreu um erro inesperado.',
            color: 'red-10',
            position: 'center',
            icon: 'error_outline',
            timeout: Math.random() * 5000 + 1000
          })
        })
      }
      this.listMarkets()
      this.mSave = false
    },

    deletarMarket () {
      let obj = {
        table: 'markets',
        conditions: [{ id: this.market.id }]
      }
      this.destroy(obj).then(() => {
        this.$q.notify({
          message: 'Supermercado deletado com sucesso!',
          color: 'green-10',
          position: 'center',
          icon: 'done_outline',
          timeout: Math.random() * 1500
        })
        this.listMarkets()
      }).catch(() => {
        this.$q.notify({
          message: 'Oooops! Ocorreu um erro inesperado.',
          color: 'red-10',
          position: 'center',
          icon: 'error_outline',
          timeout: Math.random() * 5000 + 1000
        })
      })
    },

    listMarkets () {
      let obj = {
        table: 'markets',
        values: [],
        conditions: null
      }
      this.read(obj).then((results) => {
        var len = results.length
        this.markets = []
        for (var i = 0; i < len; i++) {
          this.markets.push(results.item(i))
        }
      })
    },

    returnImg (img) {
      // Recebe os dados que foram retornado pelo $emit
      this.market.image = img
    }
  },

  components: {
    TakePicture
  },

  mixins: [price, dateTime]
}
</script>

<style>
</style>
