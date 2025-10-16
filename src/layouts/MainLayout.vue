<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          App de Escalas de Enfermagem
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <!-- A "janela" para as páginas filhas -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
defineOptions({
  name: 'MainLayout'
})
</script>

