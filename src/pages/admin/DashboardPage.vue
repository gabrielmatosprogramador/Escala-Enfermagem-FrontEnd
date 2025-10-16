<template>
  <!-- Como esta página vive DENTRO do MainLayout, ela TEM de usar <q-page> -->
  <q-page padding>
    <div class="q-mb-md">
      <div class="text-h5">Painel do Administrador</div>
      <!-- No futuro, podemos usar o ID da unidade para mostrar o nome aqui -->
      <div class="text-subtitle1">Unidade selecionada: {{ $route.query.unitId }}</div>
    </div>

    <!-- O q-card dá-nos um contentor visualmente agradável para as nossas abas -->
    <q-card>
      <!-- q-tabs é o componente que cria a barra de abas -->
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <!-- Cada q-tab é uma aba clicável.
             O 'name' é o identificador único da aba.
             O 'label' é o texto que aparece. -->
        <q-tab name="users" icon="manage_accounts" label="Gerir Utilizadores" />
        <q-tab name="sites" icon="workspaces" label="Gerir Sítios" />
        <q-tab name="schedule" icon="event" label="Criar Escala" />
      </q-tabs>

      <q-separator />

      <!-- q-tab-panels é o contentor para o conteúdo de cada aba.
           O v-model="tab" é a "cola mágica" que o liga às q-tabs.
           Quando clica numa aba, o painel correspondente é mostrado. -->
      <q-tab-panels v-model="tab" animated>
        <!-- Cada q-tab-panel corresponde a uma q-tab através do 'name'. -->
        <q-tab-panel name="users">
          <div class="text-h6">Gerir Utilizadores</div>
          Aqui ficará a lista de utilizadores e um formulário para adicionar novos.
          <div class="q-mt-md">
            <q-btn label="Adicionar Utilizador" color="primary" icon="add" />
          </div>
        </q-tab-panel>

        <q-tab-panel name="sites">
          <div class="text-h6">Gerir Sítios de Atuação</div>
          Aqui ficará a lista de sítios (ex: Bloco Operatório) e um formulário.
        </q-tab-panel>

        <q-tab-panel name="schedule">
          <div class="text-h6">Criar/Editar Escala</div>
          Aqui ficará a ferramenta principal para montar a escala mensal.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'AdminDashboardPage'
})

// Esta variável reativa controla qual aba está ativa.
// O valor inicial ('users') define qual aba aparece primeiro.
const tab = ref('users')
</script>

<style scoped>
.q-tab-panel {
  min-height: 300px; /* Garante uma altura mínima para os painéis */
}
</style>
