<template>
  <q-layout view="hhh lpr fFr">

    <q-header reveal bordered class="bg-primary text-white">
      <q-toolbar class="row">
        <q-toolbar-title class="col-8">
          <q-avatar>
            <img src="https://cdn.quasar-framework.org/logo/svg/quasar-logo.svg">
          </q-avatar>
          Minhas compras
        </q-toolbar-title>
        <q-tabs
          align="right"
          inline-label
          class="col-4 text-white"
        >
          <q-route-tab to="/register" label="Cadastrar" />
          <q-route-tab to="/login" label="Entrar" />
        </q-tabs>
      </q-toolbar>

      <q-tabs
        inline-label
        class="bg-primary text-white shadow-2"
      >
        <q-route-tab :to="{ name: 'home'}" name="mails" icon="home" label="Home" />
        <q-route-tab name="about" icon="contact_support" label="Sobre" :to="{ name: 'about'}" />
        <q-route-tab name="listProducts" icon="shop_two" label="Compras" :to="{ name: 'listProducts'}" />
        <q-tab name="photos" icon="photo" label="Photos" />
        <q-tab name="videos" icon="slow_motion_video" label="Videos" />
        <q-tab name="addressbook" icon="people" label="Address Book" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar-framework.org/logo/svg/quasar-logo.svg">
          </q-avatar>
          Minhas compras
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>
