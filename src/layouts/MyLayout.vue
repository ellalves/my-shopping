<template>
  <q-layout view="hhh lpr fFr">

    <q-header reveal bordered class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-img src="/statics/logo-transparent.png" alt="Minhas compras" style="width: 100%"/>
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs
        inline-label
        class="bg-primary text-white shadow-2"
      >
        <q-route-tab :to="{ name: 'home'}" name="mails" icon="home" label="Home" />
        <q-route-tab name="listProducts" icon="shop_two" label="Compras" :to="{ name: 'listProducts'}" />
        <q-tab name="about" icon="contact_support" label="Sobre" @click.native="mAbout = true" />
      </q-tabs>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal bordered class="bg-secondary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="/statics/ellalves.png" alt="logo ellalves">
          </q-avatar>
          <q-btn flat type="a" href="https://ellalves.net.br" label="Desenvolvido por Ellalves" />
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
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
                Versão: 1.0 <br />
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
export default {
  data () {
    return {
      mAbout: false,
      IMEI: window.device === void 0 ? 'Espere ... localizando seu dispositivo mobile/tablet' : window.device
    }
  }
}
</script>
