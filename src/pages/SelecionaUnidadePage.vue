<template>
  <q-page padding class="bg-grey-2">
    <div class="q-mb-md">
      <div class="text-h5">Selecione a Unidade de Saúde</div>
      <div class="text-subtitle1">Escolha a unidade em que deseja trabalhar.</div>
    </div>

    <q-list bordered separator class="rounded-borders bg-white">
      <q-item
        v-for="unit in units"
        :key="unit.id"
        clickable
        v-ripple
        @click="selectUnit(unit)"
      >
        <q-item-section avatar>
          <q-icon color="primary" name="local_hospital" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ unit.name }}</q-item-label>
          <q-item-label caption>{{ unit.address }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

// É uma boa prática nomear os seus componentes
defineOptions({
  name: 'SelectUnitPage'
})

const $q = useQuasar()
const router = useRouter()

// PONTO DE CORREÇÃO 1: Preenchendo a lista com dados.
// No futuro, estes dados virão de uma chamada a uma API.
const units = ref([
  { id: 1, name: 'Hospital Central de Lisboa', address: 'Rua de S. José, 1150-323' },
  { id: 2, name: 'Centro de Saúde de Sete Rios', address: 'Praça Marechal Humberto Delgado, 1500-423' },
  { id: 3, name: 'UPA de Benfica', address: 'Av. Grão Vasco, 1500-337' }
])

function selectUnit(unit) {
  $q.notify({
    message: `Unidade '${unit.name}' selecionada. A carregar painel...`
  })

  // PONTO DE CORREÇÃO 2: Redirecionando para o caminho correto e passando o ID da unidade.
  // A string `/app/admin/dashboard` corresponde exatamente à rota que definimos no routes.js
  // O `?unitId=${unit.id}` anexa a informação da unidade ao URL.
  router.push(`/app/admin/dashboard?unitId=${unit.name}`)
}
</script>

<style scoped>
.q-list {
  cursor: pointer; /* Indica ao utilizador que a lista é clicável */
}
</style>

