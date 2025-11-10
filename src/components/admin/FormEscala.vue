<template>
  <!-- O nosso modal padrão -->
  <q-dialog :model-value="show" @update:model-value="onClose" persistent>
    <q-card style="width: 500px; max-width: 90vw;">
      <q-card-section class="bg-primary text-white">
        <!-- Título (poderíamos torná-lo dinâmico para edição no futuro) -->
        <div class="text-h6">Adicionar Evento à Escala</div>
      </q-card-section>

      <q-form @submit.prevent="onSave">
        <q-card-section class="q-gutter-md">
          <!-- 
            CAMPO DE PROFISSIONAL
            - :options="users" -> Recebe a lista de utilizadores do componente pai (prop).
            - option-label="name" -> Diz ao QSelect para mostrar o campo 'name' do objeto.
            - option-value="id" -> Diz ao QSelect para usar o 'id' como valor.
            - emit-value e map-options -> Garantem que o v-model (formData.professionalId)
                                         recebe apenas o 'id', e não o objeto de utilizador inteiro.
          -->
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

          <!-- CAMPO DE SÍTIO (mesma lógica) -->
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

          <!-- CAMPO DE DATA (com popup de calendário) -->
          <q-input
            v-model="formData.date"
            label="Data"
            outlined
            mask="####/##/##"
            :rules="[val => !!val || 'A data é obrigatória']"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="formData.date" mask="YYYY/MM/DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Fechar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <!-- CAMPO DE TURNO (com opções fixas) -->
          <q-select
            v-model="formData.shift"
            :options="shiftOptions"
            label="Turno"
            outlined
            :rules="[val => !!val || 'O turno é obrigatório']"
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
import { ref, watch } from 'vue'

// --- PROPS ---
// Este componente precisa de receber as listas de 'users' e 'sites' do pai!
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  users: {
    type: Array,
    required: true
  },
  sites: {
    type: Array,
    required: true
  }
  // No futuro, poderíamos adicionar uma prop 'escalaToEdit'
})

// --- EMITS ---
const emit = defineEmits(['close', 'save'])

// Opções de turno fixas
const shiftOptions = ref(['Manhã', 'Tarde', 'Noite'])

// Molde de dados para a nova escala
const formData = ref({
  professionalId: null,
  siteId: null,
  date: '',
  shift: null
})

function onClose() {
  emit('close')
}

function onSave() {
  // Envia os dados do formulário (que contêm os IDs e a data/turno)
  emit('save', { ...formData.value })
}

// Limpa o formulário sempre que o modal é aberto
watch(() => props.show, (newValue) => {
  if (newValue) {
    // Reset do formulário
    formData.value = {
      professionalId: null,
      siteId: null,
      date: '',
      shift: null
    }
  }
})
</script>