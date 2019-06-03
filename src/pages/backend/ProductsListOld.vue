<template>
  <q-page padding>
    <!-- content -->
    <q-btn color="primary" label="Adicionar" @click.native="dialogSave('create', null)" />
    <q-list bordered separator>
      <q-item clickable v-ripple>
        <q-item-section>Lista de produtos</q-item-section>
      </q-item>

      <q-item clickable v-ripple v-for="product in products" :key="product.id">
        <q-item-section top avatar>
          <q-avatar rounded>
            <q-img :src="product.image !== null ? product.image : ''" :alt="product.image" />
          </q-avatar>
        </q-item-section>

        <q-item-section @click.native="dialogSave('update', product)">
          <q-item-label>{{product.name}}</q-item-label>
          <q-item-label caption>#ID: {{product.id}}</q-item-label>
          <q-item-label caption>Marca: {{product.mark}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <!--// Save //-->
    <q-dialog v-model="mSave">
      <q-card style="width: 700px max-width: 80vw">
        <q-card-section class="row items-center">
          <div class="text-h6"> {{titleProduct}} </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="q-gutter-sm row">
            <div class="col-6">
              <q-btn color="primary" icon="add_a_photo" label="Tirar uma foto" @click="captureImage('CAMERA')" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md']" />
              <q-btn color="positive" icon="add_photo_alternate" label="Pegar do álbum" @click="captureImage('PHOTOLIBRARY')" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md']" />
            </div>
            <q-img
              class="col-5"
              :src="product.image"
              placeholder-src="statics/quasar-logo.png"
              :alt="'Imagem: ' + product.image" id="photo"
            >
            <div v-if="product.image" class="absolute-bottom-right" style="border-top-left-radius: 5px">
              <q-btn icon="clear" @click.native="clearImage"> Apagar imagem </q-btn>
            </div>
            </q-img>
          </div>
          <q-form>
            <q-input
              v-model="product.name"
              label="Nome do produto"
              @blur="$v.product.name.$touch"
              @keyup.enter="saveProduct"
            />
            {{$v.product.name.isUnique}}
            <div class="text-red" v-if="!$v.product.name.required">Username is required.</div>
            <div class="text-red" v-if="!$v.product.name.isUnique">This username is already registered.</div>
            <q-select
              v-model="mark"
              use-input
              fill-input
              input-debounce="0"
              :options="options"
              @filter="filterFn"
              label="Marca do produto"
            >
              <template v-slot:append>
                <q-icon
                  v-if="mark !== null"
                  class="cursor-pointer"
                  name="clear"
                  @click.stop="mark = null"
                />
              </template>

              <template v-slot:no-option>
                <q-item>
                  <q-item-section>
                    Sem registros
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-btn icon="save" color="positive" label="Salvar" @click.native="saveProduct()" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md']" />
            <q-btn icon="delete_forever" color="negative" label="Deletar" v-close-popup @click.native="mDelete = true" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md']" v-if="this.type == 'update'"/>
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
import { mapActions } from 'vuex'
import { price } from '../../components/mixins/price'
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'listProducts',

  created () {
    // this.createDB()
    this.listProducts()
  },

  data () {
    return {
      options: [],
      mark: {
        label: '',
        value: '',
        icon: null
      },
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
        mark_id: 1
      },
      errors: [],
      products: {},
      total: 0.0
    }
  },

  validations () {
    return {
      product: {
        name: {
          required,
          async isUnique (value) {
            // O validador independente idealmente não deve assumir que um campo é obrigatório
            if (value === '') return true
            this.errors.name = []
            this.$v.product.$reset()
            this.readOne({ field: 'name', val: value }).then((res) => {
              if (res.length === 1) {
                console.log('count', res.length)
                this.errors.name.push('Esse produto já existe!')
                return true
              }
            })
          },

          minLength: minLength(4)
        }
      }
    }
  },

  methods: {
    ...mapActions('marks', {
      lsts: 'read',
      readSelect: 'readSelect'
    }),

    listMarks (val) {
      this.readSelect({ name: val }).then((results) => {
        var len = results.rows.length
        this.stringOptions = []
        this.total = 0
        for (var i = 0; i < len; i++) {
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

    ...mapActions('products', ['createDB', 'read', 'readOne', 'create', 'update', 'destroy']),
    dialogSave (type, product) {
      this.mSave = true
      this.type = type
      this.product = {}
      this.listMarks('')
      if (type === 'update') {
        this.titleProduct = 'Alterar produto'
        // alert('prodList: ' + JSON.stringify(product))
        var params = { field: 'id', val: product.id }
        this.readOne(params).then((res) => {
          this.product = res.item(0)
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
      this.$v.product.$touch()

      this.errors = []
      if (this.product.name.$error) {
        this.errors.push('Digite o nome do produto!')

        console.log('erro', this.$v.product.name.$error)
        console.log('Erros: ', this.errors)
        return
      }
      console.log('Agora foi!')

      this.product.mark_id = this.mark.value

      if (this.type === 'update') {
        this.update(this.product).then(() => {
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
        this.create(this.product).then(() => {
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
      this.listProducts()
      this.mSave = false
    },

    deletarProduct () {
      this.destroy(this.product).then(() => {
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

    listProducts () {
      this.read().then((results) => {
        var len = results.rows.length
        this.products = []
        this.total = 0
        // alert('DEMO table: ' + len + ' rows found.')
        for (var i = 0; i < len; i++) {
          // this.total += parseFloat(results.rows.item(i).price)
          // console.log('preço: ' + JSON.stringify(results.rows.item(i)))
          this.products.push(results.rows.item(i))
          // alert('Row = ' + i + ' ID = ' + results.rows.item(i).id + ' Data =  ' + JSON.stringify(this.products))
        }
      })
    },

    captureImage (source) {
      this.pictureSourceType(source) // Define se a foto virá da camera ou da galeria
      navigator.camera.getPicture(
        data => { // on success
          this.product.image = `data:image/jpeg;base64, ${data}`
        },
        () => { // on fail
          this.$q.notify('Não foi possível acessar a câmera do dispositivo!')
        },
        { // camera options
          quality: 50,
          destinationType: navigator.camera.DestinationType.DATA_URL,
          encodingType: navigator.camera.EncodingType.JPEG,
          sourceType: this.sourceType,
          mediaType: navigator.camera.MediaType.PHOTOLIBRARY,
          cameraDirection: navigator.camera.Direction.BACK,
          correctOrientation: true,
          saveToPhotoAlbum: true,
          allowEdit: true,
          targetWidth: 300,
          targetHeight: 400
        }
      )
    },

    pictureSourceType (type) {
      if (type === 'CAMERA') {
        this.sourceType = navigator.camera.PictureSourceType.CAMERA
      } else if (type === 'PHOTOLIBRARY') {
        this.sourceType = navigator.camera.PictureSourceType.PHOTOLIBRARY
      }
    },

    clearImage () {
      this.product.image = ''
    }
  },

  mixins: [price]
}
</script>

<style>
</style>
