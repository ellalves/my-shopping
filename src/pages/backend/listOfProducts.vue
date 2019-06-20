<template>
  <q-page>
    <q-toolbar class="bg-secondary text-white shadow-2">
      <q-toolbar-title>
        <q-btn flat icon="keyboard_arrow_left" v-go-back.single />
        Minhas listas
      </q-toolbar-title>
      <q-btn flat left dense label="Salvar" icon="done_outline" class="cursor-pointer" @click.native="addList()" />
    </q-toolbar>

    <q-card class="">
      <q-card-section>
        <q-form class="row q-gutter-xs">
          <q-select
            class="col-12"
            v-model="listItems.market_id"
            use-input
            input-debounce="0"
            label="Mercado *"
            :options="options"
            option-value="id"
            option-label="name"
            @filter="filterFn"
            emit-value
            map-options
            :dense="true"
            :rules="[ val => !!val || 'O mercado é obrigatório!!' ]"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon
                v-if="listItems.market_id !== null"
                class="cursor-pointer"
                name="clear"
                @click.stop="listItems.market_id = null"
              />
            </template>

            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-red">
                  Nenhum registro encontrado!
                  <q-btn flat :to="{ name: 'marksList' }" label="Adicionar marca" />
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            class="col-12"
            v-model="listItems.product_id"
            use-input
            :items-aligned="true"
            input-debounce="0"
            label="Produto *"
            :options="optionsProducts"
            option-value="id"
            option-label="name"
            @filter="filterFnProducts"
            emit-value
            map-options
            :dense="true"
            :rules="[ val => !!val || 'O produto é obrigatório!!' ]"
          >
            <template v-slot:append>
              <q-icon
                v-if="listItems.product_id !== null"
                class="cursor-pointer"
                name="clear"
                @click.stop="listItems.product_id = null"
              />
            </template>

            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-red">
                  Nenhum registro encontrado
                  <q-btn flat :to="{ name: 'productsList' }" label="Adicionar marca" />
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-input
            class="col-5"
            ref="input"
            type="number"
            min="0"
            v-model="listItems.quantity"
            label="Quantidade *"
            :dense="true"
            :rules="[ val => !!val || 'A quantidade do produto é obrigatório!!' ]"
          />

          <q-input
            class="col-6"
            ref="input"
            v-model="listItems.price"
            label="Valor *"
            mask="#,##"
            fill-mask="0"
            reverse-fill-mask
            :dense="true"
            :rules="[ val => !!val || 'O valor do produto é obrigatório!!' ]"
          />
          <div class="col-12">
            <!-- <q-btn icon="save" color="positive" label="Salvar" @click.native="addList()" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md']" />
            <q-btn icon="delete_forever" color="negative" label="Deletar" v-close-popup @click.native="mDelete = true" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md']" v-if="this.type == 'update'" /> -->
          </div>
        </q-form>
      </q-card-section>

      <q-separator />
    </q-card>

    <q-toolbar class="bg-positive text-white shadow-2">
      <q-toolbar-title>
        <q-btn flat icon="shopping_cart" v-go-back.single />
        Meu carrinho
      </q-toolbar-title>
      <q-btn flat left dense label="Apagar" icon="delete" class="cursor-pointer" @click.native="showDelete = !showDelete" />
    </q-toolbar>
    <q-card>
      <q-card-section>
        <q-list>
          <q-item clickable v-ripple v-for="p in prices" :key="p.id">
            <q-item-section v-if="showDelete" @click.native="deleteProduct(p.id)">
              <q-btn flat dense color="negative" icon="delete_forever" class="cursor-pointer" />
            </q-item-section>

            <q-item-section top avatar v-else>
              <q-avatar rounded>
                <q-img :src="p.product_image !== null ? p.product_image : ''" :alt="p.product_image" placeholder-src="./statics/mc-up-transparent.png" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="2">
                <span class="text-weight-medium">{{p.product}}</span>
              </q-item-label>
              <q-item-label caption lines="2">
                {{p.mark}} - {{p.market}}
              </q-item-label>
            </q-item-section>

            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn size="12px" flat :label="p.quantity" />
                <q-badge color="teal" :label="formatPrice(p.price.replace(',', '.'), 'R$ ')" />
                <q-badge color="teal" :label="formatPrice(p.price.replace(',', '.') * p.quantity, 'R$ ')" />
              </div>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label lines="1">
                <span class="text-weight-medium">Total</span>
              </q-item-label>
            </q-item-section>

            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn size="12px" flat :label="quantity" />
                <q-badge color="teal" :label="formatPrice(total, 'R$ ')" />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!--// Delete confirm //-->
    <!-- <q-dialog v-model="mDelete" persistent>
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
    </q-dialog> -->
  </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { price } from '../../components/mixins/price'
import { dateTime } from '../../components/mixins/dateTime'

export default {
  name: 'listCarts',

  created () {
    // console.log('rota', this.$route.params)
    this.listMarkets('', 20)
    this.listProducts('', 20)
    this.generateList(this.$route.params.id)
  },

  data () {
    return {
      mark: {},
      showDelete: false,
      titleCart: 'Criar lista',
      sourceType: 'CAMERA',
      type: 'add',
      mSave: false,
      mItems: false,
      listItems: {
        id: null,
        list_id: this.$route.params.id,
        market_id: null,
        product_id: null,
        user_id: null,
        quantity: 0,
        price: 0
      },
      options: [],
      optionsProducts: [],
      prices: {},
      total: 0,
      quantity: 0
    }
  },

  computed: {
    ...mapState('auth', ['me'])
  },

  methods: {
    ...mapActions('carts', ['createDB', 'read', 'select', 'readOne', 'create', 'update', 'destroy']),
    addList () {
      let obj = {
        table: 'list_items',
        fields: ['list_id', 'market_id', 'product_id', 'quantity', 'price ', 'user_id'],
        values: [this.listItems.list_id, this.listItems.market_id, this.listItems.product_id, this.listItems.quantity, this.listItems.price, this.me.id]
      }
      this.create(obj).then((res) => {
        this.listItems.product_id = ''
        this.listItems.quantity = 1
        this.listItems.price = 0
        this.generateList(this.listItems.list_id)
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
    },

    deleteProduct (id) {
      let obj = {
        table: 'list_items',
        conditions: [{ id: id }]
      }
      this.destroy(obj).then(() => {
        this.generateList(this.listItems.list_id)
        this.$q.notify({
          message: 'Produto deletado com sucesso!',
          color: 'green-10',
          position: 'center',
          icon: 'done_outline',
          timeout: Math.random() * 1500
        })
        this.listProducts()
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

    generateList (id, limit = 5) {
      let obj = {
        table: 'list_items AS l',
        select: ['l.id', 'price', 'quantity', 'p.name AS product', 'p.image AS product_image', 'm.name AS market', 'c.name AS mark'],
        fields: ['list_id'],
        values: [id],
        limit: limit,
        conditions: 'where',
        join: [
          { table: 'products AS p', on: 'product_id = p.id' },
          { table: 'marks AS c', on: 'mark_id = c.id' },
          { table: 'markets AS m', on: 'market_id = m.id' }
        ]
      }
      this.marketsOne(obj).then((results) => {
        console.log('list_items', results)
        var len = results.length
        this.prices = []
        this.total = 0
        this.quantity = 0
        let row = []
        for (let i = 0; i < len; i++) {
          row = results.item(i)
          this.total += parseFloat(row.price.replace(',', '.') * row.quantity)
          this.quantity += parseInt(row.quantity)
          this.prices.push(row)
        }
      })
    },

    ...mapActions('markets', { marketsOne: 'readOne' }),
    listMarkets (val, limit) {
      let obj = {
        table: 'markets',
        select: ['id', 'name', 'image', 'created'],
        fields: ['name'],
        values: [val],
        limit: [limit],
        conditions: 'like'
      }
      this.marketsOne(obj).then((results) => {
        // console.log('results', results)
        var len = results.length
        this.options = []
        for (let i = 0; i < len; i++) {
          let row = results.item(i)
          this.options[i] = {
            id: row.id,
            name: row.name,
            icon: row.image
          }
        }
      })
    },

    filterFn (val, update, abort) {
      update(() => {
        this.listMarkets(val)
      })
    },

    ...mapActions('products', { productsOne: 'readOne' }),
    listProducts (val, limit) {
      let obj = {
        table: 'products AS p',
        select: ['p.id', 'p.name', 'p.image', 'm.name AS mark', 'p.created'],
        fields: ['p.name'],
        values: [val],
        limit: [limit],
        conditions: 'like',
        join: [{ table: 'marks AS m', on: 'm.id = mark_id' }]
      }
      this.productsOne(obj).then((results) => {
        // console.log('results', results)
        var len = results.length
        this.optionsProducts = []
        for (let i = 0; i < len; i++) {
          let row = results.item(i)
          this.optionsProducts[i] = {
            id: row.id,
            name: row.name + ' (' + row.mark + ')',
            icon: row.image
          }
        }
      })
    },

    filterFnProducts (val, update, abort) {
      update(() => {
        this.listProducts(val)
      })
    }
  },

  mixins: [price, dateTime]
}
</script>

<style>
</style>
