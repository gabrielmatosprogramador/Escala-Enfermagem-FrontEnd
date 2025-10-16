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


defineOptions({
  name: 'SelectUnitPage'
})

const $q = useQuasar()
const router = useRouter()

//ADICIONAR AQUI A CONEXÃO COM A API PARA BUSCAR AS UNIDADES
const units = ref([
  { id: 1, name: 'US Wenceslau Fontoura', address: 'Rua Jose Luiz Martins Costa, 210' },
  { id: 2, name: 'US Batista Flores', address: 'Av. Serafim Machado, 215' }
])

function selectUnit(unit) {
  $q.notify({
    message: `Unidade '${unit.name}' selecionada. A carregar painel...`
  })

    // REDIRECIONANDO PARA A PÁGINA DE DASHBOARD DO ADMIN COM O ID DA UNIDADE PARA CARREGAMENTO DAS INFORMAÇÕES
  router.push(`/app/admin/dashboard?unitId=${unit.name}`)
}
</script>

<style scoped>
.q-list {
  cursor: pointer; /* Indica ao utilizador que a lista é clicável */
}
</style>

