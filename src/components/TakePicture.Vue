<template>
  <div>
    <q-btn color="primary" icon="add_a_photo" label="Tirar uma foto" @click="captureImage('CAMERA')" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-xs']" />
    <q-btn color="positive" icon="add_photo_alternate" label="Pegar do álbum" @click="captureImage('PHOTOLIBRARY')" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-xs']" />
    <q-img
      :src="imageSrc"
      style="max-width: 100%; height: 150px;"
      placeholder-src="statics/quasar-logo.png"
      :alt="'Imagem: ' + imageSrc" id="photo"
    />
    <div v-if="imageSrc">
      <q-btn color="negative" icon="clear" @click.native="clearImage"> Limpar imagem </q-btn>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      imageSrc: '',
      sourceType: 'CAMERA'
    }
  },

  methods: {
    captureImage (source) {
      this.pictureSourceType(source) // Define se a foto virá da camera ou da galeria
      navigator.camera.getPicture(
        data => { // on success
          this.imageSrc = `data:image/jpeg;base64, ${data}`
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
      this.imageSrc = ''
    }
  }
}
</script>

<style>
</style>
