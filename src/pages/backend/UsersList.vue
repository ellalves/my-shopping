<template>
  <q-page padding>
    <!-- content -->
    <q-btn color="primary" label="Adicionar" @click.native="dialogSave('create', null)" />
    <q-list bordered separator>
      <q-item clickable v-ripple>
        <q-item-section>Lista de usuários</q-item-section>
      </q-item>

      <q-item clickable v-ripple v-for="user in users" :key="user.id">
        <q-item-section top avatar>
          <q-avatar rounded>
            <q-img :src="user.image !== null ? user.image : ''" :alt="user.image" />
          </q-avatar>
        </q-item-section>

        <q-item-section @click.native="dialogSave('update', user)">
          <q-item-label>{{user.name}}</q-item-label>
          <q-item-label caption>#ID: {{user.id}}</q-item-label>
          <q-item-label caption>Marca: {{user.mark}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <!--// Save //-->
    <q-dialog v-model="mSave">
      <q-card style="width: 700px max-width: 80vw">
        <q-card-section class="row items-center">
          <div class="text-h6"> {{titleUser}} </div>
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
              :src="user.image"
              placeholder-src="statics/quasar-logo.png"
              :alt="'Imagem: ' + user.image" id="photo"
            >
            <div v-if="user.image" class="absolute-bottom-right" style="border-top-left-radius: 5px">
              <q-btn icon="clear" @click.native="clearImage"> Apagar imagem </q-btn>
            </div>
            </q-img>
          </div>

          <q-form>
            <q-input
              ref="input"
              v-model="user.username"
              label="Nome do usuário *"
              :rules="[ checkUserUserName ]"
            />

            <q-input
              ref="input"
              v-model="user.email"
              label="E-mail *"
              :rules="[ checkUserEmail ]"
            />

            <q-input
              ref="input"
              v-model="user.name"
              label="Nome *"
              :rules="[ val => !!val || 'O nome é obrigatória!!' ]"
            />

            <q-input
              ref="input"
              v-model="user.password"
              label="Senha *"
              :rules="[ val => !!val || 'A senha é obrigatória!!' ]"
            />

            <q-btn icon="save" color="positive" label="Salvar" @click.native="saveProduct()" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md']" />
            <q-btn icon="delete_forever" color="negative" label="Deletar" v-close-popup @click.native="mDelete = true" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md float-right']" v-if="this.type == 'update'"/>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!--// Delete confirm //-->
    <q-dialog v-model="mDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Deletar registro: {{this.user.name}}</div>
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
  name: 'listUsers',

  created () {
    // this.createDB()
    this.listUsers()
  },

  data () {
    return {
      options: [],
      mark: {},
      stringOptions: [],
      titleUser: 'Adicionar usuário',
      sourceType: 'CAMERA',
      type: 'add',
      mSave: false,
      mDelete: false,
      user: {
        id: null,
        name: '',
        image: null,
        mark_id: 1,
        user_id: 1
      },
      errors: [],
      users: {},
      total: 0.0
    }
  },

  methods: {
    ...mapActions('users', ['createDB', 'read', 'select', 'readOne', 'create', 'update', 'destroy']),
    checkUserUserName (val) {
      if (val === '') {
        return 'Não pode ser vazio'
      }

      if (val) {
        let obj = {
          table: 'users',
          select: [],
          fields: ['name'],
          values: [val],
          conditions: 'where'
        }
        return this.readOne(obj).then((res) => {
          if (res.length === 1) {
            return 'O Produto já está cadastrado!'
          }
        })
      }
    },

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

    dialogSave (type, user) {
      this.mSave = true
      this.type = type
      this.user = {}
      this.listMarks('')
      if (type === 'update') {
        this.titleUser = 'Alterar usuário'
        let obj = {
          table: 'users AS p',
          select: ['p.id, p.name, p.mark_id, m.name AS mark'],
          fields: ['p.id'],
          values: [user.id],
          conditions: 'where',
          join: [{ table: 'marks AS m', on: 'mark_id = m.id' }]
        }
        this.readOne(obj).then((res) => {
          this.user = res.item(0)
          this.mark = { // Formata os dados para o select
            label: this.user.mark,
            value: this.user.mark_id,
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
      this.user.mark_id = this.mark.value
      if (this.type === 'update') {
        let obj = {
          table: 'users',
          fields: ['name', 'image', 'mark_id', 'user_id'],
          values: [this.user.name, this.user.image, this.user.mark_id, this.user_id],
          conditions: [{ id: this.user.id }]
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
          table: 'users',
          fields: ['name, image, mark_id', 'user_id'],
          values: [this.user.name, this.user.image, this.user.mark_id, this.user.user_id]
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
      this.listUsers()
      this.mSave = false
    },

    deletarProduct () {
      let obj = {
        table: 'users',
        conditions: [{ id: this.user.id }]
      }
      this.destroy(obj).then(() => {
        this.$q.notify({
          message: 'Produto deletado com sucesso!',
          color: 'green-10',
          position: 'center',
          icon: 'done_outline',
          timeout: Math.random() * 1500
        })
        this.listUsers()
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

    listUsers () {
      let obj = {
        table: 'users AS p',
        select: ['p.id, p.name, p.mark_id, m.name AS mark'],
        values: [],
        conditions: null,
        join: [{ table: 'marks AS m', on: 'mark_id = m.id' }]
      }
      this.read(obj).then((results) => {
        var len = results.length
        this.users = []
        for (var i = 0; i < len; i++) {
          this.users.push(results.item(i))
        }
      })
    },

    captureImage (source) {
      this.pictureSourceType(source) // Define se a foto virá da camera ou da galeria
      navigator.camera.getPicture(
        data => { // on success
          this.user.image = `data:image/jpeg;base64, ${data}`
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
      this.user.image = ''
    }
  },

  mixins: [price]
}
</script>

<style>
</style>
