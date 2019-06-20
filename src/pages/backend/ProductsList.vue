<template>
  <q-page>
    <q-toolbar class="bg-secondary text-white shadow-2">
      <q-toolbar-title>
        <q-btn flat icon="keyboard_arrow_left" v-go-back.single />
        Lista de produtos
      </q-toolbar-title>
      <q-btn flat left dense label="Novo" icon="add_circle_outline" class="cursor-pointer" @click.native="dialogSave('create', null)" />
    </q-toolbar>
    <q-list bordered separator>
      <q-item clickable v-ripple v-for="product in products" :key="product.id">
        <q-item-section top avatar>
          <q-avatar rounded>
            <q-img :src="product.image" :alt="product.image" placeholder-src="./statics/mc-up-transparent.png" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{product.name}}</q-item-label>
          <q-item-label caption>#ID: {{product.id}}</q-item-label>
          <q-item-label caption>Marca: {{product.mark}}</q-item-label>
          <q-item-label caption>Atualização: {{ formatDateTime(product.created) }}</q-item-label>
        </q-item-section>

        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn flat dense round icon="border_color" color="positive" @click.native="dialogSave('update', product)" />
            <q-btn flat dense round icon="delete_forever" color="negative" @click.native="mDelete = true" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <q-btn
    @click.native="setPaginate(perPage)"
    color="secondary" label="Mais produtos ..."
    v-if="showMore"
    :loading="loadPage"
    class="full-width" />

    <!--// Save //-->
    <q-dialog v-model="mSave">
      <q-card style="width: 700px max-width: 80vw">
        <q-card-section class="row items-center">
          <div class="text-h6"> {{titleProduct}} </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <take-picture :srcImage="product.image" @takeImage="returnImg"></take-picture>
          <q-form>
            <q-input
              ref="input"
              v-model="product.name"
              label="Nome do produto *"
              :rules="[ val => !!val || 'O nome do produto é obrigatório!!' ]"
            />

            <q-select
              v-model="mark"
              use-input
              fill-input
              hide-selected
              input-debounce="0"
              :options="options"
              @filter="filterFn"
              label="Marca do produto *"
              bottom-slots
              :rules="[ val => !!val || 'A marca do produto é obrigatória!!' ]"
            >
              <template v-slot:append>
                <q-icon
                  v-if="mark !== null"
                  class="cursor-pointer"
                  name="clear"
                  @click.stop="mark = null"
                />
              </template>

              <template v-slot:hint>
                <div class="text-red" v-if="errors.length > 0">{{errors[0]}}</div>
              </template>

              <template v-slot:no-option>
                <q-item>
                  <q-item-section>
                    <div class="text-red"> Sem registros</div>
                    <q-btn flat :to="{ name: 'marksList' }" label="Adicionar marca" />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-btn icon="save" color="positive" label="Salvar" @click.native="saveProduct()" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md']" />
            <q-btn icon="delete_forever" color="negative" label="Deletar" v-close-popup @click.native="mDelete = true" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md']" v-if="this.type == 'update'" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!--// Delete confirm //-->
    <q-dialog v-model="mDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Deletar registro: {{this.product.name}}</div>
        </q-card-section>
        <q-card-section class="row items-center">
          <q-avatar icon="delete_outline" color="negative" text-color="white" />
          <span class="q-ml-sm">Essa ação não pode ser desfeita!</span>
        </q-card-section>

        <q-card-actions class="float-right">
          <q-btn flat label="Não" color="info" v-close-popup />
          <q-btn flat label="Sim" color="negative" @click.native="deletarProduct" v-close-popup />
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
  name: 'listProducts',

  created () {
    this.setPaginate(0)
    // this.listProducts(this.limit)
  },

  data () {
    return {
      options: [],
      mark: {},
      stringOptions: [],
      titleProduct: 'Adicionar produto',
      sourceType: 'CAMERA',
      type: 'add',
      mSave: false,
      mDelete: false,
      product: {
        id: null,
        name: '',
        image: null,
        mark_id: 1,
        user_id: 1,
        created: null
      },
      limit: 10,
      showMore: true,
      totalPage: 1,
      perPage: 5,
      loadPage: false,
      errors: [],
      products: {}
    }
  },

  computed: {
    ...mapState('auth', ['me'])
  },

  methods: {
    setPaginate (more) {
      this.limit += more
      this.listProducts(this.limit)
    },
    ...mapActions('products', ['createDB', 'read', 'select', 'readOne', 'create', 'update', 'destroy']),
    ...mapActions('marks', {
      readSelect: 'readSelect'
    }),

    listMarks (val) {
      this.readSelect({ name: val }).then((results) => {
        var len = results.rows.length
        this.stringOptions = []
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i)
          this.stringOptions[i] = {
            value: row.id,
            label: row.name,
            icon: row.image
          }
        }
      })
    },

    filterFn (val, update, abort) {
      update(() => {
        this.options = []
        if (val === '') {
          this.options = this.stringOptions
        } else {
          this.listMarks(val)
          this.options = this.stringOptions
        }
      })
    },

    dialogSave (type, product) {
      this.mSave = true
      this.type = type
      this.product = {}
      this.product.user_id = this.me.id
      this.listMarks('')
      if (type === 'update') {
        this.titleProduct = 'Alterar produto'
        let obj = {
          table: 'products AS p',
          select: ['p.id, p.name, p.mark_id, p.image, m.name AS mark'],
          fields: ['p.id'],
          values: [product.id],
          conditions: 'where',
          join: [{ table: 'marks AS m', on: 'mark_id = m.id' }]
        }
        this.readOne(obj).then((res) => {
          this.product = res.item(0)
          this.mark = { // Formata os dados para o select
            label: this.product.mark,
            value: this.product.mark_id,
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

    saveProduct () {
      this.product.mark_id = this.mark.value
      if (this.type === 'update') {
        let obj = {
          table: 'products',
          fields: ['name', 'image', 'mark_id', 'user_id'],
          values: [this.product.name, this.product.image, this.product.mark_id, this.product_id],
          conditions: [{ id: this.product.id }]
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
          table: 'products',
          fields: ['name', 'image', 'mark_id', 'user_id', 'created'],
          values: [this.product.name, this.product.image, this.product.mark_id, this.product.user_id, this.formatDateTimeDb(new Date())]
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
      this.listProducts(this.limit)
      this.mSave = false
    },

    deletarProduct () {
      let obj = {
        table: 'products',
        conditions: [{ id: this.product.id }]
      }
      this.destroy(obj).then(() => {
        this.$q.notify({
          message: 'Produto deletado com sucesso!',
          color: 'green-10',
          position: 'center',
          icon: 'done_outline',
          timeout: Math.random() * 1500
        })
        this.listProducts(this.limit)
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

    listProducts (limit) {
      let obj = {
        table: 'products AS p',
        select: ['p.id, p.name, p.mark_id, p.image, p.created, m.name AS mark'],
        values: [],
        limit: [limit],
        conditions: null,
        join: [{ table: 'marks AS m', on: 'mark_id = m.id' }]
      }
      this.loadPage = true
      this.read(obj).then((results) => {
        var len = results.length
        this.limit = len
        this.products = []
        for (var i = 0; i < len; i++) {
          this.products.push(results.item(i))
        }
      })
      this.read({ table: 'products', values: [], conditions: null }).then((results) => {
        this.totalPage = results.length
        if (this.totalPage <= this.limit) {
          this.showMore = false
        }
        this.loadPage = false
      })
    },

    returnImg (img) {
      // Recebe os dados que foram retornado pelo $emit
      this.product.image = img
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
