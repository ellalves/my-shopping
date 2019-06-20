<template>
  <div class="q-gutter-sm row">
    <div class="col-6">
      <q-btn color="primary" icon="add_a_photo" label="Tirar uma foto" @click="captureImage('CAMERA')" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md']" />
      <q-btn color="positive" icon="add_photo_alternate" label="Pegar do álbum" @click="captureImage('PHOTOLIBRARY')" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md']" />
    </div>
    <q-img
      class="col-5"
      :src="srcImage"
      placeholder-src="statics/quasar-logo.png"
      :alt="'Imagem: ' + srcImage" id="photo"
    >
    <div v-if="srcImage" class="absolute-bottom-right" style="border-top-left-radius: 5px">
      <q-btn icon="clear" @click.native="clearImage"> Apagar imagem </q-btn>
    </div>
    </q-img>
  </div>
</template>

<script>
export default {
  name: 'takePicture',
  props: {
    srcImage: {
      type: Object,
      required: false
    },
    isUpdate: {
      required: false,
      type: Boolean,
      default: false
    }
  },

  methods: {
    captureImage (source) {
      this.pictureSourceType(source) // Define se a foto virá da camera ou da galeria
      navigator.camera.getPicture(
        data => { // on success
          this.srcImage = `data:image/jpeg;base64, ${data}`
          this.$emit('takeImage', this.srcImage)
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
      this.srcImage = ''
    }
  }
}
</script>
