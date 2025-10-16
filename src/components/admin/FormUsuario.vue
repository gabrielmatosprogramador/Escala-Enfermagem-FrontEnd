<template>
  <!-- Este componente é uma janela de diálogo (modal) completa. -->
  <q-dialog :model-value="show" @update:model-value="onClose" persistent>
    <q-card style="width: 500px; max-width: 90vw;">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Adicionar Novo Profissional</div>
      </q-card-section>

      <!-- Usamos a tag <form> para agrupar os nossos campos.
           O evento @submit.prevent impede o recarregamento da página e chama a nossa função. -->
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
            label="Nº Conselho"
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
          <!-- O type="submit" faz com que este botão acione o evento @submit do <q-form> -->
          <q-btn label="Guardar" color="primary" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

// --- DEFINIÇÃO DAS PROPS ---
// A prop 'show' controlará se o modal está visível.
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

// --- DEFINIÇÃO DOS EMITS ---
// O evento 'close' informará o pai para fechar o modal.
// O evento 'save' enviará os dados do formulário para o pai.
const emit = defineEmits(['close', 'save'])

// --- LÓGICA INTERNA ---

// Objeto reativo para guardar os dados do formulário.
const formData = ref({
  name: '',
  licenseNumber: '',
  email: ''
})

// Função para fechar o modal. Apenas emite o evento 'close'.
function onClose() {
  emit('close')
}

// Função chamada quando o formulário é submetido.
function onSave() {
  // Emite o evento 'save' e passa uma cópia dos dados do formulário como argumento.
  emit('save', { ...formData.value })
}

// Observador (watch): Esta função é executada sempre que a prop 'show' muda.
// Usamo-la para limpar o formulário sempre que o modal é aberto.
watch(() => props.show, (newValue) => {
  if (newValue) {
    formData.value = { name: '', licenseNumber: '', email: '' }
  }
})
</script>