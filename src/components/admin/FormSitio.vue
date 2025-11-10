<template>
  <q-dialog :model-value="show" @update:model-value="onClose" persistent>
    <q-card style="width: 500px; max-width: 90vw;">
      <q-card-section class="bg-primary text-white">
        <!-- Título Dinâmico -->
        <div class="text-h6">{{ isEditing ? 'Editar Sítio' : 'Adicionar Novo Sítio' }}</div>
      </q-card-section>

      <!-- Atenção ao 'observacoes' que você usou no dashboard. 
           Vou mudar aqui para 'location' como tínhamos antes, ou pode ajustar.
           Vamos usar 'observacoes' para ser consistente com o seu dashboard. -->
      <q-form @submit.prevent="onSave">
        <q-card-section>
          <q-input
            v-model="formData.name"
            label="Nome do Sítio"
            outlined
            class="q-mb-md"
            :rules="[val => !!val || 'O nome é obrigatório']"
            lazy-rules
          />
          <q-input
            v-model="formData.observacoes"
            label="Observações (ex: 2º Andar, Ala Sul)"
            outlined
            class="q-mb-md"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn label="Cancelar" color="grey-8" flat @click="onClose" />
          <!-- Label do Botão Dinâmico -->
          <q-btn :label="isEditing ? 'Atualizar' : 'Guardar'" color="primary" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  // A NOVA PROP:
  sitioToEdit: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const isEditing = computed(() => !!props.sitioToEdit)

// Molde de dados
const formData = ref({
  id: null,
  name: '',
  observacoes: ''
})

function onClose() {
  emit('close')
}

function onSave() {
  emit('save', { ...formData.value })
}

// Observador para preencher ou limpar o formulário
watch(() => props.show, (newValue) => {
  if (newValue) {
    if (isEditing.value) {
      formData.value = { ...props.sitioToEdit }
    } else {
      formData.value = { id: null, name: '', observacoes: '' }
    }
  }
})
</script>