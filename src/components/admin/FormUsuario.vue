<template>
  <!-- O :model-value="show" permite que o v-model no pai funcione -->
  <q-dialog :model-value="show" @update:model-value="onClose" persistent>
    <q-card style="width: 500px; max-width: 90vw;">
      <q-card-section class="bg-primary text-white">
        <!-- Título Dinâmico: Muda consoante estamos a criar ou a editar -->
        <div class="text-h6">{{ isEditing ? 'Editar Profissional' : 'Adicionar Novo Profissional' }}</div>
      </q-card-section>

      <q-form @submit.prevent="onSave">
        <q-card-section>
          <q-input
            v-model="formData.name"
            label="Nome Completo"
            outlined
            class="q-mb-md"
            :rules="[val => !!val || 'O nome é obrigatório']"
            lazy-rules
          />
          <q-input
            v-model="formData.licenseNumber"
            label="Nº Cédula Profissional"
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="formData.email"
            label="Email"
            type="email"
            outlined
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
  // A NOVA PROP: Recebe o utilizador a ser editado.
  // Se for null, significa que estamos a *criar* um novo.
  userToEdit: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

// 'isEditing' é uma flag que nos diz em que modo o formulário está.
const isEditing = computed(() => !!props.userToEdit)

// Molde de dados interno do formulário
const formData = ref({
  id: null,
  name: '',
  licenseNumber: '',
  email: ''
})

function onClose() {
  emit('close')
}

function onSave() {
  // Emitimos os dados do formulário. O pai decidirá o que fazer com eles.
  emit('save', { ...formData.value })
}

// O "cérebro" da edição:
// Observamos a prop 'show'. Quando ela se torna 'true' (modal a abrir)...
watch(() => props.show, (newValue) => {
  if (newValue) {
    if (isEditing.value) {
      // MODO EDIÇÃO: Copiamos os dados da prop 'userToEdit' para o nosso formulário.
      // Usamos {...} para criar uma cópia e não modificar a prop diretamente.
      formData.value = { ...props.userToEdit }
    } else {
      // MODO CRIAR: Limpamos o formulário.
      formData.value = { id: null, name: '', licenseNumber: '', email: '' }
    }
  }
})
</script>