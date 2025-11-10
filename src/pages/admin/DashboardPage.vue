<template>
  <q-page padding class="bg-grey-2">
    <div class="q-mb-md">
      <div class="text-h5">Painel do Administrador</div>
      <div class="text-subtitle1">Unidade selecionada: {{ $route.query.unitId }}</div>
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
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h6">Gerir Profissionais</div>
            <!-- Botão ADICIONAR: Chama a função que abre o modal em modo "novo" -->
            <q-btn label="Adicionar Profissional" color="primary" icon="add" @click="openAddUserModal" />
          </div>
          <q-separator />
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
                  <!-- Botão EDITAR: Chama a função de edição, passando o utilizador -->
                  <q-btn size="sm" flat round icon="edit" color="info" @click="openEditUserModal(user)" />
                  <!-- Botão APAGAR: Chama a função de apagar, passando o utilizador -->
                  <q-btn size="sm" flat round icon="delete" color="negative" @click="onDeleteUser(user)"/>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <!-- Painel sitios -->
        <q-tab-panel name="sites">
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h6">Gerir sítios de atuação</div>
            <q-btn label="Adicionar sitio" color="primary" icon="add" @click="openAddSitioModal" />
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
                  <q-btn size="sm" flat round icon="edit" color="info" @click="openEditSitioModal(sitio)" />
                  <q-btn size="sm" flat round icon="delete" color="negative" @click="onDeleteSitio(sitio)"/>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <!-- Painel Escalas -->
        <q-tab-panel name="schedule">
          <div class="text-h6">Criar/Editar Escala</div>
          <p>Em breve aqui...</p>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- Formulário de Utilizador recebe a prop -->
    <form-usuario
      :show="showUserForm"
      :user-to-edit="userToEdit"
      @close="showUserForm = false"
      @save="handleSaveUser"
    />
    
    <!-- Formulário de Sítio agora recebe a prop 'sitioToEdit' -->
    <form-sitio
      :show="showSitioForm"
      :sitio-to-edit="sitioToEdit"
      @close="showSitioForm = false"
      @save="handleSaveSitio"
    />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import FormUsuario from 'src/components/admin/FormUsuario.vue'
import FormSitio from 'src/components/admin/FormSitio.vue'

defineOptions({ name: 'AdminDashboardPage' })

const $q = useQuasar()
// CORREÇÃO: ref() só pode ter um valor inicial
const tab = ref('users')

// --- LÓGICA DE PROFISSIONAIS (USERS) ---
const showUserForm = ref(false)
const users = ref([])
// Guarda o utilizador que está a ser editado. Se for 'null', estamos a criar um novo.
const userToEdit = ref(null)

// Abre o modal para ADICIONAR
function openAddUserModal() {
  userToEdit.value = null // Garante que estamos em modo "novo"
  showUserForm.value = true
}

// Abre o modal para EDITAR
function openEditUserModal(user) {
  userToEdit.value = user // Define o utilizador a editar
  showUserForm.value = true
}

// Função única que recebe o 'save' do formulário
function handleSaveUser(userData) {
  if (userToEdit.value) {
    // Lógica de ATUALIZAR
    const index = users.value.findIndex(u => u.id === userData.id)
    if (index !== -1) {
      users.value[index] = userData
    }
    $q.notify({ color: 'positive', message: `Profissional '${userData.name}' atualizado!` })
  } else {
    // Lógica de CRIAR
    users.value.push({ ...userData, id: Date.now() })
    $q.notify({ color: 'positive', message: `Profissional '${userData.name}' salvo!` })
  }
  showUserForm.value = false
}

// CORREÇÃO da função de apagar
function onDeleteUser(user) {
  $q.dialog({
    title: 'Confirmar',
    message: `Tem a certeza que quer apagar o profissional '${user.name}'?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    // A forma correta de apagar: filtrar a lista, mantendo todos MENOS o que queremos apagar.
    users.value = users.value.filter(u => u.id !== user.id)
    $q.notify({ color: 'positive', message: 'Profissional apagado.' })
  })
}


// --- LÓGICA DE SÍTIOS (SITES) ---
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
  if (sitioToEdit.value) {
    // Lógica de ATUALIZAR
    const index = sitios.value.findIndex(s => s.id === sitioData.id)
    if (index !== -1) {
      sitios.value[index] = sitioData
    }
    $q.notify({ color: 'positive', message: `Sítio '${sitioData.name}' atualizado!` })
  } else {
    // Lógica de CRIAR
    sitios.value.push({ ...sitioData, id: Date.now() })
    $q.notify({ color: 'positive', message: `Sítio '${sitioData.name}' salvo!` })
  }
  showSitioForm.value = false
}

// CORREÇÃO da função de apagar
function onDeleteSitio(sitio) {
  $q.dialog({
    title: 'Confirmar',
    message: `Tem a certeza que quer apagar o sítio '${sitio.name}'?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    sitios.value = sitios.value.filter(s => s.id !== sitio.id)
    $q.notify({ color: 'positive', message: 'Sítio apagado.' })
  })
}
</script>

<style scoped>
.q-tab-panel {
  min-height: 400px;
}
</style>