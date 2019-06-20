<template>
  <q-layout view="hHr lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="navDrawer = !navDrawer" color="amber-13" />

        <q-toolbar-title class="q-py-sm">
          <img src="/statics/mc-left-transparent.png" height="80px" v-if="orientation == 'portrait-primary' || orientation == 'portrait'"/>
          <img src="/statics/mc-tipo.png" height="40px" style="width: 80%" v-if="orientation == 'landscape-secondary' || orientation == 'landscape-primary'"/>
        </q-toolbar-title>
        <!-- <q-btn dense flat round icon="menu" @click="rightDrawer = !rightDrawer" color="amber-13" /> -->
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="navDrawer"
      :mini="miniNavDrawerState"
      overlay
      @mouseover="miniNavDrawerState = false"
      @mouseout="miniNavDrawerState = true"
      behavior="mobile"
      :breakpoint="500"
      show-if-above
      bordered
      content-class="bg-white"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item class="bg-grey-3">
            <q-item-section avatar top>
              <q-avatar>
                <q-img :src="me.image" height="50px" placeholder-src="./statics/user.png" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{me.username}}</q-item-label>
              <q-item-label caption>{{me.email}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-for="menuItem in menu"
            :key="'drawer_menu_' + menuItem.title"
            clickable
            v-ripple
            :to="menuItem.to"
          >
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" color="primary"/>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{menuItem.title}} </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="exit_to_app" color="primary"/>
            </q-item-section>

            <q-item-section @click.native="logoutUser">
              <q-item-label> Sair </q-item-label>
            </q-item-section>
          </q-item>
          <about class="cursor-pointer"></about>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- <q-drawer
      v-model="rightDrawer"
      side="right"
      behavior="mobile"
      overlay
      bordered
    >
      <q-list>
        <q-item class="bg-grey-3">
          <q-item-section avatar top>
            <q-avatar>
              <img src="https://cdn.quasar-framework.org/img/quasar-logo.png" height="50px" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">John Doe</q-item-label>
            <q-item-label caption>jd@test.com</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="#">
          <q-item-section avatar top>
            <q-avatar icon="person"></q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Edit Profile</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar top>
            <q-avatar icon="power_settings_new"></q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-primary text-white">
      <q-toolbar color="primary">
        <q-toolbar-title class="row justify-center items-center lt-sm text-subtitle2">
          <span>Versão: v{{version}}</span>
          <span class="on-right">
            <q-btn color="white" type="a" href="https://ellalves.net.br" target="_blank" text-color="black" icon="copyright" label="WebXpertise" size="sm" />
          </span>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import About from '../components/About'
import { mapActions, mapGetters, mapState } from 'vuex'
import ga from '../components/reports/analytics'

export default {
  created () {
    this.isLoggedIn()
    ga.logEvent('conversions', 'PurchaseDoneEvent', 'Purchase Done', '99.90')
  },

  computed: {
    ...mapGetters('auth', ['isLogged']),
    ...mapState('auth', ['me'])
  },

  data () {
    return {
      menuAuth: false,
      orientation: 'portrait-primary',
      navDrawer: true,
      miniNavDrawerState: true,
      rightDrawer: true,
      version: '0.0.1-beta',
      menu: [
        {
          icon: 'home',
          title: 'Página inicial',
          to: { name: 'home' },
          auth: false
        },
        {
          icon: 'how_to_reg',
          title: 'Perfil',
          to: { name: 'profile' },
          auth: true
        },
        {
          icon: 'shop_two',
          title: 'Produtos',
          to: { name: 'productsList' },
          auth: false
        },
        {
          icon: 'category',
          title: 'Marcas',
          to: { name: 'marksList' },
          auth: false
        },
        {
          icon: 'location_city',
          title: 'Mercados',
          to: { name: 'marketsList' },
          auth: false
        },
        {
          icon: 'shopping_cart',
          title: 'Minhas Listas',
          to: { name: 'cart' },
          auth: true
        }
      ]
    }
  },

  methods: {
    ...mapActions('auth', ['logout']),
    isLoggedIn () {
      if (!this.isLogged) {
        this.logoutUser()
      }
    },

    logoutUser () {
      this.logout()
      this.$router.push({ name: 'login' }) // Redireciona
    }
  },

  components: {
    About
  }
}
</script>
