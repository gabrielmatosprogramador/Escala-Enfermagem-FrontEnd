<template>
  <q-dialog :model-value="show" @update:model-value="onClose" persistent>
    <q-card style="width: 500px; max-width: 90vw;">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Adicionar Novo Sítio de Atuação</div>
      </q-card-section>

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
            v-model="formData.location"
            label="Localização (ex: 2º Andar, Ala Sul)"
            outlined
            class="q-mb-md"
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

// Props define a entrada de dados para o componente
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

//emits define os eventos que o componente pode emitir para o componente pai (DashboardPage)
const emit = defineEmits(['close', 'save'])

//variaveis reativas, "molde" de dados para o formulário
const formData = ref({
  name: '',
  location: ''
})

function onClose() {
  emit('close')
}

function onSave() {
  // Emite o evento 'save' com os dados do formulário
  emit('save', { ...formData.value })
}

// Limpa o formulário sempre que o modal é aberto
watch(() => props.show, (newValue) => {
  if (newValue) {
    formData.value = { name: '', location: '' }
  }
})
</script>