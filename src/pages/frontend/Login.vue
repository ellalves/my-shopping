<template>
  <q-page>
    <q-toolbar class="bg-secondary text-white shadow-2">
      <q-toolbar-title>
        <q-btn flat icon="keyboard_arrow_left" v-go-back.single />
        Entrar
      </q-toolbar-title>
      <q-btn flat left dense label="Novo" icon="add_shopping_cart" class="cursor-pointer" :to="{ name: 'home' }" />
    </q-toolbar>
    <div class="row flex-center">
      <q-card flat class="col-md-4 col-sm-8 col-xs-12 q-ma-md">
          <q-card-section>
            <div class="text-subtitle2">Preencha o fromulário para acessar a área restrita</div>
          </q-card-section>

        <q-card-section>
          <q-input v-model="user.email" type="email" label="E-mail"
        />
          <q-input v-model="user.password" :type="isPwd ? 'password' : 'text'" label="Senha"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-toggle
            v-model="rememberMe"
            checked-icon="check"
            color="green"
            unchecked-icon="clear"
            label="Salvar os dados da sessão"
          />

          <q-btn color="primary" class="full-width q-mt-md" label="Entrar" icon-right="send" @click.native="loginUser" />
          <q-btn color="accent" class="full-width q-mt-md" label="Cadastre-se" icon-right="person_add" :to="{ name: 'register' }" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Login',

  mounted () {
    if (this.isLogged()) {
      this.$router.push({ name: 'profile' })
    }
  },

  data () {
    return {
      user: {
        email: '',
        password: ''
      },
      me: [],
      isPwd: true,
      rememberMe: false
    }
  },

  methods: {
    ...mapGetters('auth', ['isLogged', 'login']),
    ...mapActions('auth', ['login']),
    ...mapMutations('auth', { add: 'LOGIN_USER' }),
    loginUser () {
      let obj = {
        table: 'users',
        fields: ['email', 'password'],
        values: [this.user.email, this.user.password],
        conditions: 'where',
        limit: [1]
      }
      this.login(obj).then((res) => {
        for (let i = 0; i < res.length; i++) { // Faz a iteração para pegar os dados da Promise
          this.me.push(res.item(i))
        }
        this.add(this.me[0]) // Coloca os dados do usuário no state
        this.rememberMe ? this.$q.localStorage.set('AUTH', this.me[0]) : this.$q.sessionStorage.set('AUTH', this.me[0])

        this.$router.push({ name: 'profile' }) // Redireciona
      }).catch(() => {
        this.$q.notify({
          message: 'E-mail ou senha inválidos!',
          type: 'negative',
          color: 'negative',
          icon: 'error_outline',
          position: 'center'
        })
      })
    }
  }
}
</script>

<style>
</style>
