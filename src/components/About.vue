<template>
  <div>
    <q-item @click.native="mAbout = true">
      <q-item-section avatar>
        <q-icon name="contact_support" color="primary"/>
      </q-item-section>

      <q-item-section>
        Sobre
      </q-item-section>
    </q-item>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      mAbout: false
    }
  }
}
</script>
