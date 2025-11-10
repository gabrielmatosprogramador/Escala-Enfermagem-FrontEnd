<template>
  <q-dialog :model-value="show" @update:model-value="onClose" persistent>
    <q-card style="width: 500px; max-width: 90vw;">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Adicionar Evento à Escala</div>
      </q-card-section>

      <q-form @submit.prevent="onSave">
        <q-card-section class="q-gutter-md">
          <!-- O seletor de Profissional continua igual -->
          <q-select
            v-model="formData.professionalId"
            :options="users"
            option-label="name"
            option-value="id"
            label="Profissional"
            outlined
            emit-value
            map-options
            :rules="[val => !!val || 'O profissional é obrigatório']"
            lazy-rules
          />

          <!-- O seletor de Sítio continua igual -->
          <q-select
            v-model="formData.siteId"
            :options="sites"
            option-label="name"
            option-value="id"
            label="Sítio de Atuação"
            outlined
            emit-value
            map-options
            :rules="[val => !!val || 'O sítio é obrigatório']"
            lazy-rules
          />

          <!--
            MUDANÇA 1: CAMPO DE DATA (AGORA COM INTERVALO)
            O q-input agora é só um "gatilho" visual para o popup.
            Usamos uma 'computed property' (dateRangeDisplay) para mostrar o texto.
          -->
          <q-input
            :model-value="dateRangeDisplay"
            label="Datas"
            outlined
            readonly
            :rules="[val => !!formData.dates || 'A data é obrigatória']"
            lazy-rules
            class="cursor-pointer"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <!--
                    A MÁGICA ESTÁ AQUI:
                    1. Adicionamos a prop 'range' ao q-date.
                    2. O v-model agora está ligado a 'formData.dates'.
                  -->
                  <q-date v-model="formData.dates" range mask="YYYY/MM/DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Fechar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <!--
            MUDANÇA 2: CAMPO DE TURNO (AGORA COM MÚLTIPLA SELEÇÃO)
            1. Adicionamos a prop 'multiple'.
            2. Adicionamos 'use-chips' para um visual melhor.
            3. O v-model 'formData.shifts' é agora um array.
          -->
          <q-select
            v-model="formData.shifts"
            :options="shiftOptions"
            label="Turnos"
            outlined
            multiple
            use-chips
            :rules="[val => val && val.length > 0 || 'Selecione pelo menos um turno']"
            lazy-rules
          />

        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn label="Cancelar" color="grey-8" flat @click="onClose" />
          <q-btn label="Guardar" color="primary" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  users: { type: Array, required: true },
  sites: { type: Array, required: true }
})

const emit = defineEmits(['close', 'save'])

const shiftOptions = ref(['Manhã', 'Tarde', 'Noite'])

// --- MUDANÇA 3: ATUALIZAR O MOLDE DOS DADOS ---
const formData = ref({
  professionalId: null,
  siteId: null,
  dates: null, // De 'date: ""' para 'dates: null'. Vai guardar { from: '...', to: '...' }
  shifts: []  // De 'shift: null' para 'shifts: []'. Vai guardar ['Manhã', 'Tarde']
})

// Esta 'computed property' cria o texto para o campo de data.
const dateRangeDisplay = computed(() => {
  if (!formData.value.dates) {
    return 'Selecione um dia ou um intervalo'
  }
  if (typeof formData.value.dates === 'string') {
    // Caso o utilizador selecione só um dia
    return formData.value.dates
  }
  if (formData.value.dates.from && formData.value.dates.to) {
    // Caso selecione um intervalo
    return `${formData.value.dates.from} até ${formData.value.dates.to}`
  }
  // Caso esteja a meio da seleção
  return 'A selecionar intervalo...'
})

function onClose() {
  emit('close')
}

function onSave() {
  emit('save', { ...formData.value })
}

// Limpa o formulário quando o modal é aberto
watch(() => props.show, (newValue) => {
  if (newValue) {
    formData.value = {
      professionalId: null,
      siteId: null,
      dates: null,
      shifts: []
    }
  }
})
</script>