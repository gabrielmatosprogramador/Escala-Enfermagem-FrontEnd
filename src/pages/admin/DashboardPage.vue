<template>
  <q-page padding class="bg-grey-2">
    <div class="q-mb-md">
      <div class="text-h5">Painel do Administrador</div>
      <div class="text-subtitle1">Unidade selecionada:  {{ $route.query.unitId }}</div>
    </div>

    <q-card>
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify">
        <q-tab name="users" icon="manage_accounts" label="Gerir Profissionais" />
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
                  <q-btn size="sm" flat round icon="delete" color="negative" @click="onDeleteUser()"/>
                </div>
              </q-item-section>
            </q-item>
          </q-list>

        </q-tab-panel>

        <!-- Painel sitios -->
        <q-tab-panel name="sites">
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h6">Gerir sítios de atuação</div>
            <q-btn label="Adicionar sitio" color="primary" icon="add" @click="showSitioForm = true" />
          </div>

          <q-separator />

          <q-list class="q-mt-md" bordered separator>
            <q-item v-for="sitio in sitios" :key="sitio.id">
              <q-item-section>
                <q-item-label>{{ sitio.name }}</q-item-label>
                <q-item-label caption>Observações: {{ sitio.observacoes || 'N/A' }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="row q-gutter-sm">
                  <q-btn size="sm" flat round icon="edit" color="info" />
                  <q-btn size="sm" flat round icon="delete" color="negative" @click="onDeleteSitio()"/>
                </div>
              </q-item-section>
            </q-item>



          </q-list>



        </q-tab-panel>
        <q-tab-panel name="schedule">
          <div class="text-h6">Criar/Editar Escala</div>
          <p>Em breve aqui...</p>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- Chamar os forms aqui e alterar a visualização na TAB -->
    <form-usuario
      :show="showUserForm"
      @close="showUserForm = false"
      @save="onSaveUser"
    />
    <form-sitio
      :show="showSitioForm"
      @close="showSitioForm = false"
      @save="onSaveSitio"
    />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import FormUsuario from 'src/components/admin/FormUsuario.vue'
import FormSitio from 'src/components/admin/FormSitio.vue'

defineOptions({
  name: 'AdminDashboardPage'
})

const $q = useQuasar()
const tab = ref('users', 'sites')

// --- LÓGICA PARA O FORMULÁRIO DE UTILIZADOR ---
const showUserForm = ref(false)

const showSitioForm = ref(false)
// Array reativo para guardar a nossa lista de utilizadores.
// No futuro, estes dados virão da base de dados.
const users = ref([
])

const sitios = ref([
])

function onSaveUser(userData) {
  console.log('Guardar novo utilizador:', userData)
 
  users.value.push({
    id: Date.now(),
    ...userData
  })

  $q.notify({
    color: 'positive',
    message: `Profissional '${userData.name}'Profissional salvo com sucesso!`
  })

  showUserForm.value = false
}

function onDeleteUser(userData) {
  console.log('Guardar novo utilizador:', userData)
 
  users.value.pop({
    id: Date.now(),
    ...userData
  })
  $q.notify({
    color: 'negative',
    message: `Profissional '${userData.name}' eliminado com sucesso!`
  })
  showUserForm.value = false
}

function onSaveSitio(sitioData) {
  console.log('Guardar novo sitio:', sitioData)
  
  sitios.value.push({
    id: Date.now(), 
    ...sitioData
  })

  $q.notify({
    color: 'positive',
    message: `Sitio '${sitioData.name}'Sítio salvo com sucesso!`
  })

  showSitioForm.value = false
}

function onDeleteSitio(sitioData) {
  console.log('deleta sitio:', sitioData)
  sitios.value.pop({
    id: Date.now(),
    ...sitioData
  })

  $q.notify({
    color: 'positive',
    message: `Sitio '${sitioData.name}'Sítio deletado com sucesso!`
  })

  showSitioForm.value = false
}
</script>

<style scoped>
.q-tab-panel {
  min-height: 400px;
}


</style>

