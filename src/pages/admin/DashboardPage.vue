<template>
  <q-page padding class="bg-grey-2">
    <div class="q-mb-md">
      <div class="text-h5">Painel do Administrador</div>
      <div class="text-subtitle1">Unidade selecionada: ID {{ $route.query.unitId }}</div>
    </div>

    <q-card>
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify">
        <q-tab name="users" icon="manage_accounts" label="Gerir Utilizadores" />
        <q-tab name="sites" icon="workspaces" label="Gerir Sítios" />
        <q-tab name="schedule" icon="event" label="Criar Escala" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <!-- Painel de Gestão de Utilizadores -->
        <q-tab-panel name="users">
          <!-- CABEÇALHO DA SECÇÃO: Título à esquerda, botão à direita. Fica acima da lista. -->
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h6">Gerir Profissionais</div>
            <q-btn label="Adicionar Profissional" color="primary" icon="add" @click="showUserForm = true" />
          </div>

          <!-- Separador visual entre o cabeçalho e o conteúdo -->
          <q-separator />

          <!-- A LISTA DE UTILIZADORES (com dados fictícios por agora) -->
          <q-list class="q-mt-md" bordered separator>
            <q-item v-for="user in users" :key="user.id">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" icon="person" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ user.name }}</q-item-label>
                <q-item-label caption>Conselho: {{ user.licenseNumber || 'N/A' }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="row q-gutter-sm">
                  <q-btn size="sm" flat round icon="edit" color="info" />
                  <q-btn size="sm" flat round icon="delete" color="negative" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>

        </q-tab-panel>

        <!-- Outros painéis -->
        <q-tab-panel name="sites">
          <div class="text-h6">Gerir Sítios de Atuação</div>
          <p>Em breve aqui...</p>
        </q-tab-panel>
        <q-tab-panel name="schedule">
          <div class="text-h6">Criar/Editar Escala</div>
          <p>Em breve aqui...</p>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- O nosso formulário continua a ser chamado aqui em baixo -->
    <form-usuario
      :show="showUserForm"
      @close="showUserForm = false"
      @save="onSaveUser"
    />

  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import FormUsuario from 'src/components/admin/FormUsuario.vue'

defineOptions({
  name: 'AdminDashboardPage'
})

const $q = useQuasar()
const tab = ref('users')

// --- LÓGICA PARA O FORMULÁRIO DE UTILIZADOR ---
const showUserForm = ref(false)

// Array reativo para guardar a nossa lista de utilizadores.
// No futuro, estes dados virão da base de dados.
const users = ref([
])

function onSaveUser(userData) {
  console.log('Guardar novo utilizador:', userData)
  // Adiciona o novo utilizador à nossa lista (com um ID temporário)
  users.value.push({
    id: Date.now(), // Usamos o timestamp como ID único por agora
    ...userData
  })

  $q.notify({
    color: 'positive',
    message: `Profissional '${userData.name}' guardado com sucesso!`
  })

  showUserForm.value = false
}
</script>

<style scoped>
.q-tab-panel {
  min-height: 400px;
}
</style>

