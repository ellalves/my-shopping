<template>
  <q-page>
    <q-toolbar class="bg-secondary text-white shadow-2">
      <q-toolbar-title>
        <q-btn flat icon="keyboard_arrow_left" v-go-back.single />
        Meus dados
      </q-toolbar-title>
      <q-btn flat left dense label="Salvar" icon="save" class="cursor-pointer" @click.native="save" />
    </q-toolbar>
    <div class="q-ma-md">
      <q-card flat class="col-md-6 col-xs-12">
        <q-card-section>
          <div class="text-subtitle2">Preencha o formulário para atualizar seus dados</div>
        </q-card-section>

        <q-card-section>
          <user-form :user="userData" :isUpdate="true"></user-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import userForm from '../../components/global/UserForm'
export default {
  name: 'Profile',
  data () {
    return {
      userData: {}
    }
  },

  mounted () {
    this.user()
  },

  computed: {
    ...mapState('auth', ['me'])
  },

  methods: {
    ...mapActions('auth', ['readOne']),
    user () {
      let obj = {
        table: 'users',
        fields: ['id'],
        values: [this.me.id],
        conditions: 'where',
        limit: [1]
      }
      this.readOne(obj).then((res) => {
        this.userData = res[0]
      })
    }
  },

  components: {
    userForm
  }
}
</script>

<style>
</style>
