<template>
  <q-page>
    <q-toolbar class="bg-secondary text-white shadow-2">
      <q-toolbar-title>
        <q-btn flat icon="keyboard_arrow_left" v-go-back.single />
        Minhas listas
      </q-toolbar-title>
      <q-btn flat left dense label="Novo" icon="add_shopping_cart" class="cursor-pointer" @click.native="dialogSave('create', null)" />
    </q-toolbar>

    <q-list bordered separator>
      <q-item
        v-for="cart in carts"
        :key="cart.id"
        :to="{ name: 'listOfProducts', params: { id: cart.id } }"
      >
        <q-item-section avatar>
          <q-avatar rounded>
            <q-img :src="cart.image !== null ? cart.image : ''" :alt="cart.image" placeholder-src="./statics/mc-up-transparent.png" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{cart.name}}</q-item-label>
          <q-item-label caption>#ID: {{cart.id}}</q-item-label>
          <q-item-label caption>Atualização: {{ formatDateTime(cart.created) }}</q-item-label>
        </q-item-section>

        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn flat dense round icon="border_color" color="positive" @click.native="dialogSave('update', cart)" />
            <q-btn flat dense round icon="delete_forever" color="negative" @click.native="mDelete = true" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <!--// Save //-->
    <q-dialog v-model="mSave">
      <q-card style="width: 700px max-width: 80vw">
        <q-card-section class="row items-center">
          <div class="text-h6"> {{titleCart}} </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form>
            <q-input
              ref="input"
              v-model="cart.name"
              label="Nome da lista *"
              :rules="[ checkCartName ]"
            />
            <q-btn icon="save" color="positive" label="Salvar" @click.native="saveCart()" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md']" />
            <q-btn icon="delete_forever" color="negative" label="Deletar" v-close-popup @click.native="mDelete = true" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md']" v-if="this.type == 'update'" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!--// Delete confirm //-->
    <q-dialog v-model="mDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Deletar registro: {{this.cart.name}}</div>
        </q-card-section>
        <q-card-section class="row items-center">
          <q-avatar icon="delete_outline" color="negative" text-color="white" />
          <span class="q-ml-sm">Essa ação não pode ser desfeita!</span>
        </q-card-section>

        <q-card-actions class="float-right">
          <q-btn flat label="Não" color="info" v-close-popup />
          <q-btn flat label="Sim" color="negative" @click.native="deletarCart" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { price } from '../../components/mixins/price'
import { dateTime } from '../../components/mixins/dateTime'

export default {
  name: 'listCarts',

  created () {
    this.listCarts()
  },

  data () {
    return {
      mark: {},
      titleCart: 'Criar lista',
      sourceType: 'CAMERA',
      type: 'add',
      mSave: false,
      mItems: false,
      maximizedToggle: false,
      mDelete: false,
      cart: {
        id: null,
        name: '',
        image: null,
        mark_id: 1,
        user_id: 1,
        created: null
      },
      listItems: {
        id: null,
        list_id: null,
        market_id: null,
        product_id: null,
        user_id: null,
        price: 0
      },
      options: [],
      optionsProducts: [],
      prices: {},
      total: 0,
      quantity: 0,
      carts: {}
    }
  },

  computed: {
    ...mapState('auth', ['me'])
  },

  methods: {
    ...mapActions('carts', ['createDB', 'read', 'select', 'readOne', 'create', 'update', 'destroy']),
    checkCartName (val) {
      if (val === '') {
        return 'Não pode ser vazio'
      }

      if (val) {
        let obj = {
          table: 'lists',
          select: [],
          fields: ['name', 'id'],
          values: [val, this.me.id],
          conditions: 'where'
        }
        return this.readOne(obj).then((res) => {
          if (res.length === 1) {
            return 'A lista já existe!'
          }
        })
      }
    },

    dialogSave (type, cart) {
      this.mSave = true
      this.type = type
      this.cart = {}
      this.cart.user_id = this.me.id
      this.listCarts('')
      if (type === 'update') {
        this.titleCart = 'Alterar lista'
        let obj = {
          table: 'lists',
          select: ['id, name'],
          fields: ['id'],
          values: [cart.id],
          conditions: 'where'
        }
        this.readOne(obj).then((res) => {
          this.cart = res.item(0)
          this.mark = { // Formata os dados para o select
            label: this.cart.mark,
            value: this.cart.mark_id,
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

    saveCart () {
      this.cart.mark_id = this.mark.value
      if (this.type === 'update') {
        let obj = {
          table: 'lists',
          fields: ['name', 'user_id'],
          values: [this.cart.name, this.cart_id],
          conditions: [{ id: this.cart.id }]
        }
        this.update(obj).then(() => {
          this.$q.notify({
            message: 'Produto atualizado com sucesso!',
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
          table: 'lists',
          fields: ['name', 'user_id', 'created'],
          values: [this.cart.name, this.cart.user_id, this.formatDateTimeDb(new Date())]
        }
        this.create(obj).then((res) => {
          this.$q.notify({
            message: 'Produto adicionado com sucesso!',
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
      this.listCarts()
      this.mSave = false
    },

    deletarCart () {
      let obj = {
        table: 'lists',
        conditions: [{ id: this.cart.id }]
      }
      this.destroy(obj).then(() => {
        this.$q.notify({
          message: 'Produto deletado com sucesso!',
          color: 'green-10',
          position: 'center',
          icon: 'done_outline',
          timeout: Math.random() * 1500
        })
        this.listCarts()
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

    listCarts () {
      let obj = {
        table: 'lists',
        select: ['id', 'name', 'created'],
        values: [],
        conditions: null
      }
      this.read(obj).then((results) => {
        var len = results.length
        this.carts = []
        for (var i = 0; i < len; i++) {
          this.carts.push(results.item(i))
        }
      })
    }
  },

  mixins: [price, dateTime]
}
</script>

<style>
</style>
