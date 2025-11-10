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
        <!-- Painel Profissionais -->
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
            <!-- Este botão abre o novo FormEscala -->
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

    <!-- Formulários (Modais) -->
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
import { ref, computed } from 'vue' // Importar 'computed'
import { useQuasar } from 'quasar'
import FormUsuario from 'src/components/admin/FormUsuario.vue'
import FormSitio from 'src/components/admin/FormSitio.vue'
// 1. IMPORTAR O NOVO FORMULÁRIO
import FormEscala from 'src/components/admin/FormEscala.vue'

defineOptions({ name: 'AdminDashboardPage' })

const $q = useQuasar()
const tab = ref('users') // CORREÇÃO: ref() só pode ter um valor inicial

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

// computed property para saber se estamos a editar
const isEditingUser = computed(() => !!userToEdit.value)

function handleSaveUser(userData) {
  if (isEditingUser.value) { // Modo Edição
    const index = users.value.findIndex(u => u.id === userData.id)
    if (index !== -1) users.value[index] = userData
    $q.notify({ color: 'positive', message: `Profissional '${userData.name}' atualizado!` })
  } else { // Modo Criação
    users.value.push({ ...userData, id: Date.now() })
    $q.notify({ color: 'positive', message: `Profissional '${userData.name}' salvo com sucesso!` })
  }
  showUserForm.value = false
}

// CORREÇÃO: A função de apagar precisa de saber QUEM apagar.
function onDeleteUser(user) {
  $q.dialog({
    title: 'Confirmar',
    message: `Tem a certeza que quer apagar '${user.name}'?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    users.value = users.value.filter(u => u.id !== user.id)
    $q.notify({ color: 'positive', message: `Profissional '${user.name}' eliminado.` })
  })
}


// --- LÓGICA SÍTIOS (SITES) ---
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

const isEditingSitio = computed(() => !!sitioToEdit.value)

function handleSaveSitio(sitioData) {
  // Ajuste para usar a sua nomenclatura 'observacoes'
  const dataToSave = { ...sitioData, observacoes: sitioData.observacoes || '' }

  if (isEditingSitio.value) { // Modo Edição
    const index = sitios.value.findIndex(s => s.id === dataToSave.id)
    if (index !== -1) sitios.value[index] = dataToSave
    $q.notify({ color: 'positive', message: `Sítio '${dataToSave.name}' atualizado!` })
  } else { // Modo Criação
    sitios.value.push({ ...dataToSave, id: Date.now() })
    $q.notify({ color: 'positive', message: `Sítio '${dataToSave.name}' salvo com sucesso!` })
  }
  showSitioForm.value = false
}

// CORREÇÃO: A função de apagar precisa de saber QUAL sítio apagar.
function onDeleteSitio(sitio) {
   $q.dialog({
    title: 'Confirmar',
    message: `Tem a certeza que quer apagar '${sitio.name}'?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    sitios.value = sitios.value.filter(s => s.id !== sitio.id)
    $q.notify({ color: 'positive', message: `Sítio '${sitio.name}' deletado com sucesso!` })
  })
}

// --- LÓGICA ESCALAS (SCHEDULE) ---
const showEscalaForm = ref(false)
const escalas = ref([]) // A nossa nova lista de escalas

/**
 * Função auxiliar para obter todos os dias num intervalo de datas.
 * As datas vêm no formato 'YYYY/MM/DD'.
 */
function getDatesInRange(startDateStr, endDateStr) {
  const dates = []
  const currentDate = new Date(startDateStr)
  const endDate = new Date(endDateStr)

  // Ajuste de fuso horário simples para evitar problemas
  currentDate.setMinutes(currentDate.getMinutes() + currentDate.getTimezoneOffset())
  endDate.setMinutes(endDate.getMinutes() + endDate.getTimezoneOffset())

  while (currentDate <= endDate) {
    // Formata a data de volta para 'YYYY/MM/DD'
    dates.push(currentDate.toISOString().split('T')[0].replace(/-/g, '/'))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return dates
}

// FUNÇÃO ATUALIZADA para lidar com intervalos e múltiplos turnos
function onSaveEscala(escalaData) {
  const { professionalId, siteId, dates, shifts } = escalaData

  // 1. Obter a lista de datas
  let dateStrings = []
  if (typeof dates === 'string') {
    // Caso o utilizador tenha selecionado só um dia
    dateStrings.push(dates)
  } else if (dates && dates.from) {
    // Caso tenha selecionado um intervalo
    dateStrings = getDatesInRange(dates.from, dates.to)
  }

  // 2. Iterar e criar as entradas de escala
  let escalasCriadasCount = 0
  for (const date of dateStrings) {
    for (const shift of shifts) {
      const newEscala = {
        id: Date.now() + escalasCriadasCount, // ID único para cada entrada
        professionalId,
        siteId,
        date,
        shift
      }
      escalas.value.push(newEscala)
      escalasCriadasCount++
    }
  }

  $q.notify({
    color: 'positive',
    message: `${escalasCriadasCount} evento(s) de escala criados com sucesso!`
  })
  showEscalaForm.value = false
}

// Função para apagar uma escala individual
function onDeleteEscala(escala) {
   $q.dialog({
    title: 'Confirmar',
    message: `Apagar esta escala? (${getUserName(escala.professionalId)} em ${escala.date})`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    escalas.value = escalas.value.filter(e => e.id !== escala.id)
    $q.notify({ color: 'positive', message: 'Escala apagada.' })
  })
}

// Funções auxiliares para mostrar nomes
function getUserName(id) {
  const user = users.value.find(u => u.id === id)
  return user ? user.name : 'Profissional inválido'
}
function getSiteName(id) {
  const site = sitios.value.find(s => s.id === id)
  return site ? site.name : 'Sítio inválido'
}
</script>

<style scoped>
.q-tab-panel {
  min-height: 400px;
}
</style>