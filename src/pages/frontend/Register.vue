<template>
  <q-page>
    <q-toolbar class="bg-secondary text-white shadow-2">
      <q-toolbar-title>
        <q-btn flat icon="keyboard_arrow_left" v-go-back.single />
        Cadastrar
      </q-toolbar-title>
      <q-btn flat left dense label="Salvar" icon="save" class="cursor-pointer" @click.native="save" />
    </q-toolbar>
    <div class="q-ma-md">
      <q-card flat class="col-md-6 col-xs-12">
        <q-card-section>
          <div class="text-h6">Cadastro de usuário</div>
          <div class="text-subtitle2">Preencha o formulário para efetuar seu cadastro</div>
        </q-card-section>

        <q-card-section>
          <user-form :user="user"></user-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import userForm from '../../components/global/UserForm'
export default {
  name: 'Register',
  data () {
    return {
      user: {}
    }
  },
  components: {
    userForm
  }
}
</script>

<style>
</style>
