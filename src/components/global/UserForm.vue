<template>
  <div class="row gutter-sm q-col-gutter-md">
    <div :class="modifyField">
      <q-input v-model="user.name" class="no-margin" label="Nome" />
    </div>
    <div class="col-xs-12 col-sm-6">
      <q-input
        v-model="user.username"
        label="Usuário"
        class="no-margin"
        :rules="[ checkUsername ]"
      />
    </div>
    <div class="col-xs-12 col-sm-6">
      <q-input v-model="user.phone" type="tel" class="no-margin" label="Celular" mask="(##)#####-####" />
    </div>
    <div class="col-xs-12 col-sm-6">
      <q-input v-model="user.birth" type="date" class="no-margin" label="Data de nascimento" />
    </div>
    <div class="col-xs-12 col-sm-6">
      <div class="caption">Sexo</div>
        <q-option-group
          :options="options"
          label="Notifications"
          type="radio"
          v-model="user.sex"
        />
    </div>
    <div class="col-xs-12 col-sm-6">
      <q-input
        v-model="user.email"
        type="email"
        label="E-mail"
        class="no-margin"
        :rules="[ checkEmail ]"
      />
      <span class="text-caption text-red" v-if="errors.email">{{errors.email[0]}}</span>
    </div>
    <div class="col-xs-12 col-sm-6">
      <q-input v-model="user.password" :type="isPwd ? 'password' : 'text'" label="Senha">
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
        <q-tooltip self="top middle">
          Digite sua senha
        </q-tooltip>
      </q-input>
    </div>
    <div class="col-xs-12 col-sm-6" v-if="!isUpdate">
      <q-input v-model="user.password_confirmation" :type="isPwdConfirmation ? 'password' : 'text'" label="Confirmar sua senha">
        <template v-slot:append>
          <q-icon
            :name="isPwdConfirmation ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwdConfirmation = !isPwdConfirmation"
          />
        </template>
        <q-tooltip self="top middle">
          Confirme a sua senha
        </q-tooltip>
      </q-input>
    </div>
    <div class="col-xs-12 col-sm-6 full-width q-mt-md" v-if="isUpdate">
      <q-input v-model="user.about" autogrow placeholder="Sobre mim" type="textarea" />
    </div>
    <div :class="[{'full-width': this.$q.platform.is.mobile}, '']">
      <q-btn color="primary" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-xs']" icon="save" label="Salvar" @click.native="save" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { dateTime } from '../mixins/dateTime'

export default {
  name: 'Register',

  props: {
    user: {
      type: Object,
      required: false
    },
    isUpdate: {
      required: false,
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      isPwd: true,
      isPwdConfirmation: true,
      errors: {},
      options: [
        { label: 'Masculino', value: 'male', color: 'blue' },
        { label: 'Feminino', value: 'female', color: 'pink' },
        { label: 'Outros', value: 'other', color: 'grey' }
      ],
      modifyField: [this.isUpdate ? 'col-12' : 'col-xs-12 col-sm-6', '']
    }
  },

  computed: {
  },

  methods: {
    ...mapActions('auth', ['create', 'readOne', 'update']),
    checkUsername (val) {
      if (val === '') {
        return 'Não pode ser vazio'
      }

      if (val) {
        let obj = {
          table: 'users',
          select: [],
          fields: ['username =', 'id <>'],
          values: [val, this.user.id],
          conditions: 'where'
        }
        return this.readOne(obj).then((res) => {
          if (res.length === 1) {
            return 'O usuário já está cadastrado!'
          }
        })
      }
    },
    checkEmail (val) {
      if (val === '') {
        return 'Não pode ser vazio'
      }

      if (val) {
        let obj = {
          table: 'users',
          select: [],
          fields: ['email =', 'id <>'],
          values: [val, this.user.id],
          conditions: 'where'
        }
        return this.readOne(obj).then((res) => {
          if (res.length === 1) {
            return 'O email já está cadastrado!'
          }
        })
      }
    },
    save () {
      let action = {}
      let obj = {
        table: 'users',
        fields: ['name', 'username', 'password', 'email', 'sex', 'birth', 'phone', 'image', 'created'],
        values: [
          this.user.name,
          this.user.username,
          this.user.password,
          this.user.email,
          this.user.sex,
          this.user.birth,
          this.user.phone,
          this.user.image,
          this.formatDateTimeDb(new Date())
        ]
      }
      if (this.isUpdate) {
        action = this.update(obj)
      } else {
        action = this.create(obj)
      }

      action
        .then(() => {
          this.$q.notify({
            message: 'Usuário criado com sucesso!',
            color: 'green-10',
            position: 'center',
            icon: 'done_outline',
            timeout: Math.random() * 5000 + 3000
          })

          this.$router.push({ name: 'login' })
        })
        .catch((err) => {
          this.errors = err.response.data.errors
          this.$q.notify({
            message: 'Oooops! Ocorreu um erro inesperado.',
            color: 'red-10',
            position: 'center',
            icon: 'error_outline',
            timeout: Math.random() * 5000 + 3000
          })
        })
    },

    backHome () {
      this.$router.push({ name: 'home' })
    }
  },

  mixins: [dateTime]
}
</script>

<style>
</style>
