<template>
  <q-page padding>
    <!-- content -->
    <q-btn color="primary" label="Adicionar" @click.native="dialogSave('create', null)" />
    <q-list bordered separator>
      <q-item clickable v-ripple>
        <q-item-section>Lista de marcas</q-item-section>
      </q-item>

      <q-item clickable v-ripple v-for="mark in marks" :key="mark.id">
        <q-item-section top avatar>
          <q-avatar rounded>
            <q-img :src="mark.image !== null ? mark.image : ''" :alt="mark.image" />
          </q-avatar>
        </q-item-section>

        <q-item-section @click.native="dialogSave('update', mark)">
          <q-item-label>{{mark.name}}</q-item-label>
          <q-item-label caption>#ID: {{mark.id}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <!--// Save //-->
    <q-dialog v-model="mSave">
      <q-card style="width: 700px max-width: 80vw">
        <q-card-section class="row items-center">
          <div class="text-h6"> {{titleMark}} </div>
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
              :src="mark.image"
              placeholder-src="statics/quasar-logo.png"
              :alt="'Imagem: ' + mark.image" id="photo"
            >
            <div v-if="mark.image" class="absolute-bottom-right" style="border-top-left-radius: 5px">
              <q-btn icon="clear" @click.native="clearImage"> Apagar imagem </q-btn>
            </div>
            </q-img>
          </div>
          <q-form>
            <q-input
              v-model="mark.name"
              label="Nome do produto"
            />
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
          <div class="text-h6">Deletar registro: {{this.mark.name}}</div>
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
export default {
  name: 'listMarks',

  created () {
    // this.createDB()
    this.listMarks()
  },

  data () {
    return {
      titleMark: 'Adicionar marca',
      sourceType: 'CAMERA',
      type: 'add',
      mSave: false,
      mDelete: false,
      mark: {
        id: null,
        name: '',
        image: null,
        mark_id: 1
      },
      marks: {},
      total: 0.0
    }
  },

  methods: {
    ...mapActions('marks', ['createDB', 'read', 'readOne', 'create', 'update', 'destroy']),
    dialogSave (type, mark) {
      this.mSave = true
      this.type = type
      this.mark = {}
      if (type === 'update') {
        this.titleMark = 'Alterar marca'
        // alert('prodList: ' + JSON.stringify(mark))
        this.readOne(mark).then((res) => {
          this.mark = res.item(0)
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
      if (this.type === 'update') {
        this.update(this.mark).then(() => {
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
        this.create(this.mark).then(() => {
          this.$q.notify({
            message: 'Produto adicionado com sucesso!',
            color: 'green-10',
            position: 'center',
            icon: 'done_outline',
            timeout: Math.random() * 1500
          })
        }).catch((err) => {
          this.$q.notify({
            message: 'Oooops! Ocorreu um erro inesperado.' + JSON.stringify(err.message),
            color: 'red-10',
            position: 'center',
            icon: 'error_outline',
            timeout: Math.random() * 5000 + 1000
          })
        })
      }
      this.listMarks()
      // this.mark = {}
      this.mSave = false
    },

    deletarProduct () {
      this.destroy(this.mark).then(() => {
        this.$q.notify({
          message: 'Produto deletado com sucesso!',
          color: 'green-10',
          position: 'center',
          icon: 'done_outline',
          timeout: Math.random() * 1500
        })
        this.listMarks()
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

    listMarks () {
      this.read().then((results) => {
        var len = results.rows.length
        this.marks = []
        this.total = 0
        for (var i = 0; i < len; i++) {
          this.total += parseFloat(results.rows.item(i).price)
          this.marks.push(results.rows.item(i))
        }
      })
    },

    captureImage (source) {
      this.pictureSourceType(source) // Define se a foto virá da camera ou da galeria
      navigator.camera.getPicture(
        data => { // on success
          this.mark.image = `data:image/jpeg;base64, ${data}`
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
      this.mark.image = ''
    }
  },

  mixins: [price]
}
</script>

<style>
</style>
