<template>
  <!-- USANDO DIV, porque está FORA de um layout -->
  <div class="fullscreen bg-blue-grey-1 text-center q-pa-md flex flex-center">
    <q-card class="q-pa-md" style="width: 400px;">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Controle de Escalas</div>
        <div class="text-subtitle2">Por favor, realize o login</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="username"
          label="Usuário"
          outlined
          class="q-mb-md"
          @keyup.enter="handleLogin"
        />
        <q-input
          v-model="password"
          label="Senha"
          type="password"
          outlined
          @keyup.enter="handleLogin"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Entrar" color="primary" @click="handleLogin" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const $q = useQuasar()
const router = useRouter()

function handleLogin() {
  if (username.value && password.value) {
    $q.notify({
      color: 'positive',
      message: 'Login bem-sucedido!'
    })
    // REDIRECIONANDO PARA O CAMINHO CORRETO
    router.push('/app/select-unit')
  } else {
    $q.notify({
      color: 'negative',
      message: 'Utilizador ou senha inválidos.'
    })
  }
}
</script>

