<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
    <div class="bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl border border-outline-variant/50 flex flex-col overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b border-surface-variant flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">barcode_scanner</span>
          </div>
          <div>
            <h3 class="text-headline-md font-headline-md font-bold text-on-surface">Escanear Código de Barras</h3>
            <p class="text-label-sm font-label-sm text-on-surface-variant">Localize livros rapidamente pelo ISBN ou código</p>
          </div>
        </div>
        <button
          @click="store.closeModal"
          class="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Scanner Visual Frame -->
      <div class="p-6 flex flex-col items-center gap-5">
        <div class="relative w-full max-w-xs aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-white border-2 border-accent/60 shadow-inner">
          <!-- Laser Scan Animation -->
          <div class="absolute inset-x-4 h-0.5 bg-accent shadow-[0_0_12px_#3B82F6] animate-bounce"></div>

          <span class="material-symbols-outlined text-5xl text-accent/80 mb-2">barcode</span>
          <span class="text-xs text-slate-300 font-medium px-4 text-center">Aponte a câmera para o código de barras no verso do livro</span>

          <div class="absolute bottom-2 left-0 w-full text-center">
            <span class="text-[10px] bg-black/60 px-2 py-0.5 rounded text-slate-400">Leitor ISBN Ativo</span>
          </div>
        </div>

        <!-- Manual ISBN Input Field -->
        <div class="w-full">
          <label class="block text-xs font-bold text-on-surface-variant mb-1.5">Ou digite o ISBN do livro:</label>
          <div class="flex gap-2">
            <div class="relative flex-1">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline">dialpad</span>
              <input
                v-model="isbnQuery"
                @keyup.enter="lookupIsbn"
                type="text"
                placeholder="Ex: 9788576573135"
                class="w-full pl-11 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-accent outline-none font-mono"
              />
            </div>
            <button
              @click="lookupIsbn"
              :disabled="isLoading || !isbnQuery.trim()"
              class="bg-accent text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-accent-hover disabled:opacity-50 transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <span v-if="isLoading" class="material-symbols-outlined animate-spin text-sm">progress_activity</span>
              <span v-else class="material-symbols-outlined text-sm">search</span>
              <span>Localizar</span>
            </button>
          </div>
        </div>

        <!-- Quick Demo ISBNs -->
        <div class="w-full bg-surface-container-low p-3.5 rounded-xl border border-surface-variant">
          <span class="block text-[11px] font-bold text-outline uppercase tracking-wider mb-2">Testar Códigos Rápidos de Exemplo:</span>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="demo in demoBooks"
              :key="demo.isbn"
              @click="testIsbn(demo.isbn)"
              class="px-2.5 py-1 bg-surface-container-lowest hover:bg-surface-container-high rounded-lg text-xs font-medium text-on-surface border border-outline-variant/30 transition-colors"
            >
              {{ demo.name }}
            </button>
          </div>
        </div>

        <!-- Found Book Preview -->
        <div
          v-if="foundBook"
          class="w-full bg-surface-container-low/80 border border-accent/30 p-4 rounded-xl flex gap-3.5 items-center animate-fade-in"
        >
          <div class="w-14 h-20 rounded-md overflow-hidden bg-surface-container shrink-0 shadow-sm">
            <img
              v-if="foundBook.coverUrl"
              :src="foundBook.coverUrl"
              :alt="foundBook.title"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex-1 min-w-0">
            <span class="text-[10px] font-bold text-accent uppercase">Livro Encontrado!</span>
            <h4 class="font-bold text-on-surface text-sm truncate">{{ foundBook.title }}</h4>
            <p class="text-xs text-on-surface-variant truncate">{{ foundBook.author }}</p>
            <p class="text-[11px] text-outline mt-0.5">{{ foundBook.totalPages }} páginas • {{ foundBook.genre }}</p>
          </div>
          <button
            @click="addFoundBook"
            class="bg-primary text-on-primary px-3 py-2 rounded-lg font-bold text-xs hover:bg-slate-900 active:scale-95 transition-all shrink-0 shadow-sm"
          >
            + Adicionar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBookStore } from '@/store/bookStore'
import { googleBooksService } from '@/services/googleBooksService'

const store = useBookStore()
const isbnQuery = ref('')
const isLoading = ref(false)
const foundBook = ref(null)

const demoBooks = [
  { name: 'O Hobbit', isbn: '9788595084742' },
  { name: 'Harry Potter 1', isbn: '9788532511010' },
  { name: 'A Revolução dos Bichos', isbn: '9788535909555' },
]

async function lookupIsbn() {
  if (!isbnQuery.value.trim()) return
  isLoading.value = true
  foundBook.value = null
  try {
    const book = await googleBooksService.searchByIsbn(isbnQuery.value)
    if (book) {
      foundBook.value = book
    } else {
      store.showNotification('Nenhum livro encontrado para este ISBN', 'info')
    }
  } catch (e) {
    store.showNotification('Erro ao buscar ISBN na API', 'error')
  } finally {
    isLoading.value = false
  }
}

function testIsbn(isbn) {
  isbnQuery.value = isbn
  lookupIsbn()
}

function addFoundBook() {
  if (!foundBook.value) return
  store.addBook({
    title: foundBook.value.title,
    author: foundBook.value.author,
    genre: foundBook.value.genre,
    format: 'physical',
    status: 'to-read',
    totalPages: foundBook.value.totalPages || 0,
    coverUrl: foundBook.value.coverUrl,
    description: foundBook.value.description,
    isbn: foundBook.value.isbn,
  })
  store.closeModal()
}
</script>
