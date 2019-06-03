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
                <img src="/statics/ellalves.png" height="50px" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">Ell Alves</q-item-label>
              <q-item-label caption>everton@webxpertise.com.br</q-item-label>
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
          <about></about>
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
        <q-toolbar-title class="row justify-between items-center gt-xs text-subtitle2">
          <span>&copy; <a href="#" target="_blank" class="text-white">Your Awesome App</a> - v{{version}}</span>
          <span class="on-right">
            <a href="https://discordapp.com/channels/415874313728688138" target="_blank" style="color:white;" class="on-left">Support Chat</a>
            <q-btn color="white" text-color="black" size="sm">Support</q-btn>
          </span>
        </q-toolbar-title>
        <q-toolbar-title class="row justify-center items-center lt-sm text-subtitle2">
          <span>v{{version}}</span>
          <span class="on-right">
            <a href="https://discordapp.com/channels/415874313728688138" target="_blank" style="color:white;" class="on-left">Support Forum</a>
            <q-btn color="white" text-color="black" icon="far fa-question-circle" size="sm"/>
          </span>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import About from '../components/About'

export default {
  data () {
    return {
      orientation: 'portrait-primary',
      navDrawer: true,
      miniNavDrawerState: true,
      rightDrawer: true,
      version: '0.0.1-beta-1',
      menu: [
        {
          icon: 'home',
          title: 'Página inicial',
          to: { name: 'home' }
        },
        {
          icon: 'shop_two',
          title: 'Compras',
          to: { name: 'productsList' }
        },
        {
          icon: 'category',
          title: 'Marcas',
          to: { name: 'marksList' }
        },
        {
          icon: 'settings',
          title: 'System',
          to: '/system'
        }
      ]
    }
  },

  components: {
    About
  }
}
</script>
