<template>
  <q-page padding>
    <!-- content -->
    <q-btn color="primary" label="Adicionar" @click.native="dialogSave('create', null)" />
    <q-list bordered separator>
      <q-item clickable v-ripple>
        <q-item-section>Lista de produtos {{ products }}</q-item-section>
      </q-item>

      <q-item clickable v-ripple v-for="product in products" :key="product.id">
        <q-item-section @click.native="dialogSave('update', product)">
          <q-item-label>{{product.name}}</q-item-label>
          <q-item-label caption>#ID: {{product.id}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <!--// Save //-->
    <q-dialog v-model="mSave">
      <q-card style="width: 700px max-width: 80vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Salvar produto</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form>
            <q-input
              v-model="product.name"
              label="Nome do produto"
            />
            <q-btn icon="save" color="positive" label="Salvar" @click.native="saveProduct" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md']"/>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'listProducts',

  created () {
    this.createDB()
    this.listProducts()
  },

  data () {
    return {
      type: 'add',
      mSave: false,
      product: {
        id: '',
        name: ''
      },
      products: {
        rows: []
      }
    }
  },

  methods: {
    ...mapMutations('products', ['LOAD_PRODUCT', 'LOAD_PRODUCTS']),
    ...mapActions('products', ['promessQuery', 'createDB', 'read', 'readOne', 'create', 'update']),
    dialogSave (type, product) {
      this.mSave = true
      this.type = type
      this.product = {}
      if (type === 'update') {
        this.readOne({ params: product }).then((res) => {
          this.product = res[0]
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
      console.log('salvar: ', JSON.stringify(this.product))
      if (this.type === 'update') {
        this.update(this.product).then(() => {
          this.$q.notify({
            message: 'Produto atualizado com sucesso!',
            color: 'green-10',
            position: 'center',
            icon: 'done_outline',
            timeout: Math.random() * 5000 + 3000
          })
        }).catch((err) => {
          this.$q.notify({
            message: 'Oooops! Ocorreu um erro inesperado.' + JSON.stringify(err),
            color: 'red-10',
            position: 'center',
            icon: 'error_outline',
            timeout: Math.random() * 5000 + 3000
          })
        })
      } else {
        this.create([this.product.name]).then(() => {
          this.$q.notify({
            message: 'Produto adicionado com sucesso!',
            color: 'green-10',
            position: 'center',
            icon: 'done_outline',
            timeout: Math.random() * 5000 + 3000
          })
        }).catch((err) => {
          this.$q.notify({
            message: 'Oooops! Ocorreu um erro inesperado.' + JSON.stringify(err),
            color: 'red-10',
            position: 'center',
            icon: 'error_outline',
            timeout: Math.random() * 5000 + 3000
          })
        })
      }
      this.listProducts()
      // this.product = {}
      this.mSave = false
    },

    listProducts () {
      this.read().then((res) => {
        this.products = res.rows
        console.log('products: ' + JSON.stringify(this.products))
      })
    }
  }
}
</script>

<style>
</style>
