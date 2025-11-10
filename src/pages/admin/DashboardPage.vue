<template>
  <q-page padding class="bg-grey-2">
    <div class="q-mb-md">
      <div class="text-h5">Painel do Administrador</div>
      <div class="text-subtitle1">Unidade selecionada:  {{ $route.query.unitId }}</div>
    </div>

    <q-card>
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify">
        <q-tab name="users" icon="manage_accounts" label="Gerir Profissionais" />
        <q-tab name="sites" icon="workspaces" label="Gerir Sítios" />
        <q-tab name="schedule" icon="event" label="Criar Escala" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <!-- Painel de Gestão de Profissionais -->
        <q-tab-panel name="users">
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h6">Gerir Profissionais</div>
            <q-btn label="Adicionar Profissional" color="primary" icon="add" @click="openAddUserModal" />
          </div>
          <q-separator />
          <q-list class="q-mt-md" bordered separator>
            <!-- CORREÇÃO: Passar 'user' para as funções de clique -->
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
                  <q-btn size="sm" flat round icon="edit" color="info" @click="openEditUserModal(user)" />
                  <q-btn size="sm" flat round icon="delete" color="negative" @click="onDeleteUser(user)"/>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <!-- Painel Sítios -->
        <q-tab-panel name="sites">
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h6">Gerir sítios de atuação</div>
            <q-btn label="Adicionar sitio" color="primary" icon="add" @click="openAddSitioModal" />
          </div>
          <q-separator />
          <q-list class="q-mt-md" bordered separator>
            <!-- CORREÇÃO: Passar 'sitio' para as funções de clique -->
            <q-item v-for="sitio in sitios" :key="sitio.id">
              <q-item-section avatar>
                <q-avatar color="secondary" text-color="white" icon="workspaces" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ sitio.name }}</q-item-label>
                <q-item-label caption>Observações: {{ sitio.observacoes || 'N/A' }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row q-gutter-sm">
                  <q-btn size="sm" flat round icon="edit" color="info" @click="openEditSitioModal(sitio)" />
                  <q-btn size="sm" flat round icon="delete" color="negative" @click="onDeleteSitio(sitio)"/>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <!-- Painel Escalas (AGORA COM CONTEÚDO) -->
        <q-tab-panel name="schedule">
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h6">Criar/Editar Escala</div>
            <q-btn label="Adicionar à Escala" color="primary" icon="add" @click="showEscalaForm = true" />
          </div>
          <q-separator />
          <!-- Lista das escalas já criadas -->
          <q-list classs="q-mt-md" bordered separator>
            <q-item-label header>Escalas Criadas</q-item-label>
            <q-item v-for="escala in escalas" :key="escala.id">
              <q-item-section avatar>
                <q-avatar color="grey-6" text-color="white" icon="event" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ getUserName(escala.professionalId) }}</q-item-label>
                <q-item-label caption>
                  {{ getSiteName(escala.siteId) }} em {{ escala.date }} ({{ escala.shift }})
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                 <!-- No futuro, podemos adicionar botões de editar/apagar escala -->
                <q-btn size="sm" flat round icon="delete" color="negative" @click="onDeleteEscala(escala)"/>
              </q-item-section>
            </q-item>
            <q-item v-if="escalas.length === 0">
              <q-item-section class="text-grey-7">
                Nenhuma escala criada ainda.
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- Chamar os forms aqui e alterar a visualização na TAB -->
    <form-usuario
      :show="showUserForm"
      :user-to-edit="userToEdit"
      @close="showUserForm = false"
      @save="handleSaveUser"
    />
    <form-sitio
      :show="showSitioForm"
      :sitio-to-edit="sitioToEdit"
      @close="showSitioForm = false"
      @save="handleSaveSitio"
    />
    <!-- NOSSO NOVO FORMULÁRIO EM AÇÃO -->
    <form-escala
      :show="showEscalaForm"
      :users="users"
      :sites="sitios"
      @close="showEscalaForm = false"
      @save="onSaveEscala"
    />

  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import FormUsuario from 'src/components/admin/FormUsuario.vue'
import FormSitio from 'src/components/admin/FormSitio.vue'
// 1. IMPORTAR O NOVO FORMULÁRIO
import FormEscala from 'src/components/admin/FormEscala.vue'

defineOptions({ name: 'AdminDashboardPage' })

const $q = useQuasar()
// CORREÇÃO: ref() só pode ter um valor inicial
const tab = ref('users')

// --- LÓGICA PROFISSIONAIS (USERS) ---
const showUserForm = ref(false)
const users = ref([])
const userToEdit = ref(null)

function openAddUserModal() {
  userToEdit.value = null
  showUserForm.value = true
}
function openEditUserModal(user) {
  userToEdit.value = user
  showUserForm.value = true
}

function handleSaveUser(userData) {
  if (userToEdit.value) { // Modo Edição
    const index = users.value.findIndex(u => u.id === userData.id)
    if (index !== -1) users.value[index] = userData
    $q.notify({ color: 'positive', message: `Profissional '${userData.name}' atualizado!` })
  } else { // Modo Criação
    users.value.push({ ...userData, id: Date.now() })
    // CORREÇÃO: Mensagem de notificação
    $q.notify({ color: 'positive', message: `Profissional '${userData.name}' salvo com sucesso!` })
  }
  showUserForm.value = false
}


function onDeleteUser(user) {
  $q.dialog({
    title: 'Confirmar',
    message: `Tem a certeza que quer apagar '${user.name}'?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    // CORREÇÃO: Usar .filter() para remover o item específico, não .pop()
    users.value = users.value.filter(u => u.id !== user.id)
    $q.notify({ color: 'positive', message: `Profissional '${user.name}' eliminado.` })
  })
  // Apagar o "showUserForm.value = false" daqui, não faz sentido.
}


//LÓGICA SÍTIOS
const showSitioForm = ref(false)
const sitios = ref([])
const sitioToEdit = ref(null)

function openAddSitioModal() {
  sitioToEdit.value = null
  showSitioForm.value = true
}
function openEditSitioModal(sitio) {
  sitioToEdit.value = sitio
  showSitioForm.value = true
}

function handleSaveSitio(sitioData) {
  if (sitioToEdit.value) { // Modo Edição
    const index = sitios.value.findIndex(s => s.id === sitioData.id)
    if (index !== -1) sitios.value[index] = sitioData
    $q.notify({ color: 'positive', message: `Sítio '${sitioData.name}' atualizado!` })
  } else { // Modo Criação
    sitios.value.push({ ...sitioData, id: Date.now() })
    // CORREÇÃO: Mensagem de notificação
    $q.notify({ color: 'positive', message: `Sítio '${sitioData.name}' salvo com sucesso!` })
  }
  showSitioForm.value = false
}


function onDeleteSitio(sitio) {
   $q.dialog({
    title: 'Confirmar',
    message: `Tem a certeza que quer apagar '${sitio.name}'?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    // CORREÇÃO: Usar .filter() para remover o item específico
    sitios.value = sitios.value.filter(s => s.id !== sitio.id)
    // CORREÇÃO: Mensagem de notificação
    $q.notify({ color: 'positive', message: `Sítio '${sitio.name}' deletado com sucesso!` })
  })
}

//LÓGICA ESCALAS
const showEscalaForm = ref(false)
const escalas = ref([]) // A nossa nova lista de escalas

// Função para guardar a nova escala
function onSaveEscala(escalaData) {
  // escalaData contém { professionalId, siteId, date, shift }
  const newEscala = { id: Date.now(), ...escalaData }
  escalas.value.push(newEscala)
  
  $q.notify({ color: 'positive', message: 'Escala criada com sucesso!' })
  showEscalaForm.value = false
}

// Função para apagar uma escala
function onDeleteEscala(escala) {
   $q.dialog({
    title: 'Confirmar',
    message: `Apagar esta escala?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    escalas.value = escalas.value.filter(e => e.id !== escala.id)
    $q.notify({ color: 'positive', message: 'Escala apagada.' })
  })
}

// Funções auxiliares para mostrar os nomes na lista, em vez de IDs
function getUserName(id) {
  const user = users.value.find(u => u.id === id)
  return user ? user.name : 'Profissional não encontrado'
}
function getSiteName(id) {
  const site = sitios.value.find(s => s.id === id)
  return site ? site.name : 'Sítio não encontrado'
}
</script>

<style scoped>
.q-tab-panel {
  min-height: 400px;
}
</style>