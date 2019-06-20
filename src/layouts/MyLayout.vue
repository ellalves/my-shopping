<template>
  <q-layout view="hhh lpr fFr">

    <q-header reveal bordered class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-img src="/statics/mc-left-transparent.png" alt="Minhas compras" />
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs inline-label class="bg-primary text-white shadow-2">
        <q-route-tab :to="{ name: 'home'}" name="home" icon="home" label="Início" />
        <q-route-tab :to="{ name: 'login'}" name="Sobre" icon="contact_support" label="Login" v-if="!isLogged" />
        <q-route-tab :to="{ name: 'profile'}" name="Perfil" icon="how_to_reg" label="Perfil" v-else />
      </q-tabs>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="mAbout" class="flex flex-center">
      <q-card>
        <q-bar class="bg-primary text-white">
          <q-icon name="help_outline" />
          <div>Sobre</div>

          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Fechar</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <q-list dense bordered padding class="rounded-borders">
            <q-item clickable v-ripple>
              <q-item-section>
                <strong>Minhas Compras</strong>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                Versão: 0.0.1-beta <br />
                Copyright 2019 - WebXpertise. <br />
                Todos os direitos reservados
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      mAbout: false,
      IMEI: window.device === void 0 ? 'Espere ... localizando seu dispositivo mobile/tablet' : window.device
    }
  },

  computed: {
    ...mapGetters('auth', ['isLogged'])
  }
}
</script>
