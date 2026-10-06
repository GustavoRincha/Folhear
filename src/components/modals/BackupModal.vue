<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
    <div class="bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl border border-outline-variant/50 flex flex-col overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b border-surface-variant flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">cloud_sync</span>
          </div>
          <div>
            <h3 class="text-headline-md font-headline-md font-bold text-on-surface">Backup e Dados</h3>
            <p class="text-label-sm font-label-sm text-on-surface-variant">Exporte ou restaure sua biblioteca</p>
          </div>
        </div>
        <button
          @click="store.closeModal"
          class="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 flex flex-col gap-4">
        <!-- Export -->
        <div class="p-4 bg-surface-container-low rounded-xl border border-surface-variant flex items-center justify-between gap-4">
          <div>
            <h4 class="font-bold text-sm text-on-surface">Exportar Biblioteca</h4>
            <p class="text-xs text-on-surface-variant">Baixe um arquivo JSON com todos os seus livros e anotações.</p>
          </div>
          <button
            @click="store.exportBackup"
            class="px-4 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-xs hover:bg-slate-900 active:scale-95 shadow-sm transition-all flex items-center gap-1.5 shrink-0"
          >
            <span class="material-symbols-outlined text-sm">download</span>
            <span>Exportar</span>
          </button>
        </div>

        <!-- Import -->
        <div class="p-4 bg-surface-container-low rounded-xl border border-surface-variant flex items-center justify-between gap-4">
          <div>
            <h4 class="font-bold text-sm text-on-surface">Importar Backup</h4>
            <p class="text-xs text-on-surface-variant">Restaure sua biblioteca a partir de um arquivo JSON anterior.</p>
          </div>
          <div>
            <input
              type="file"
              ref="fileInput"
              accept=".json"
              class="hidden"
              @change="handleFileUpload"
            />
            <button
              @click="$refs.fileInput.click()"
              class="px-4 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg font-bold text-xs hover:bg-surface-container active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
            >
              <span class="material-symbols-outlined text-sm">upload_file</span>
              <span>Importar</span>
            </button>
          </div>
        </div>

        <!-- Reset / Limpar Biblioteca -->
        <div class="p-4 bg-error-container/15 rounded-xl border border-error-container/40 flex items-center justify-between gap-4">
          <div>
            <h4 class="font-bold text-sm text-error">Limpar Toda a Biblioteca</h4>
            <p class="text-xs text-on-surface-variant">Remove todos os livros salvos e deixa sua estante vazia.</p>
          </div>
          <button
            @click="handleReset"
            class="px-3.5 py-2 text-error hover:bg-error-container/30 border border-error/30 rounded-lg font-bold text-xs transition-colors shrink-0"
          >
            Limpar Tudo
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-surface-variant flex justify-end bg-surface-container-low/40">
        <button
          @click="store.closeModal"
          class="px-5 py-2 bg-primary text-on-primary rounded-lg font-bold text-xs hover:bg-slate-900 transition-colors shadow-sm"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBookStore } from '@/store/bookStore'

const store = useBookStore()
const fileInput = ref(null)

function handleFileUpload(e) {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    store.importBackup(event.target.result)
    store.closeModal()
  }
  reader.readAsText(file)
}

function handleReset() {
  if (confirm('Deseja realmente apagar todos os livros e zerar sua estante?')) {
    store.clearAllBooks()
    store.closeModal()
  }
}
</script>
