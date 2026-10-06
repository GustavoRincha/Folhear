<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
    <div
      v-if="book"
      class="bg-surface-container-lowest rounded-2xl w-full max-w-2xl max-h-[92vh] shadow-2xl border border-outline-variant/50 flex flex-col overflow-hidden"
    >
      <!-- Modal Top Bar -->
      <div class="p-4 sm:p-6 border-b border-surface-variant flex items-center justify-between bg-surface-container-low/40">
        <div class="flex items-center gap-2">
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5',
              statusBadge.bgClass
            ]"
          >
            <span class="material-symbols-outlined text-sm">{{ statusBadge.icon }}</span>
            {{ statusBadge.label }}
          </span>
          <span class="text-xs text-outline font-medium">{{ book.genre }}</span>
        </div>

        <div class="flex items-center gap-2">
          <!-- Favorite Star -->
          <button
            @click="toggleFavorite"
            class="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center transition-colors"
            :title="editableBook.favorite ? 'Remover dos favoritos' : 'Favoritar livro'"
          >
            <span class="material-symbols-outlined text-xl" :class="editableBook.favorite ? 'text-amber-500 fill' : 'text-outline'">
              star
            </span>
          </button>

          <!-- Close Button -->
          <button
            @click="store.closeModal"
            class="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-6">
        <!-- Top Section: Cover & Book Info -->
        <div class="flex flex-col sm:flex-row gap-5 items-start">
          <!-- Cover Image & Quick Cover Actions -->
          <div class="flex flex-col items-center gap-2 shrink-0 mx-auto sm:mx-0">
            <div class="w-28 sm:w-36 aspect-[2/3] rounded-xl overflow-hidden shadow-md bg-slate-100 shrink-0 border border-slate-200">
              <BookCover
                :cover-url="editableBook.coverUrl"
                :title="editableBook.title"
                :author="editableBook.author"
                :genre="editableBook.genre"
                :isbn="editableBook.isbn"
                size="md"
                container-class="w-full h-full"
              />
            </div>

            <!-- Cover Actions -->
            <div class="flex items-center gap-1.5 w-full justify-center">
              <label class="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1 shadow-sm" title="Tirar foto ou enviar imagem da capa">
                <span class="material-symbols-outlined text-xs">photo_camera</span>
                <span>Foto</span>
                <input type="file" accept="image/*" class="hidden" @change="handleCoverUpload" />
              </label>

              <button
                type="button"
                @click="searchOnlineCovers"
                :disabled="isSearchingCovers"
                class="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-accent text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                title="Buscar capas online"
              >
                <span v-if="isSearchingCovers" class="material-symbols-outlined animate-spin text-xs">progress_activity</span>
                <span v-else class="material-symbols-outlined text-xs">search</span>
                <span>Buscar</span>
              </button>
            </div>
          </div>

          <!-- Basic Metadata Fields -->
          <div class="flex-1 min-w-0 w-full flex flex-col gap-2">
            <div>
              <label class="text-[11px] font-bold uppercase tracking-wider text-outline">Título</label>
              <input
                v-model="editableBook.title"
                type="text"
                class="w-full text-headline-md font-headline-md font-bold text-on-surface bg-transparent border-b border-dashed border-outline-variant/60 focus:border-accent outline-none py-1"
              />
            </div>

            <div>
              <label class="text-[11px] font-bold uppercase tracking-wider text-outline">Autor(a)</label>
              <input
                v-model="editableBook.author"
                type="text"
                class="w-full text-body-md font-body-md text-on-surface-variant bg-transparent border-b border-dashed border-outline-variant/60 focus:border-accent outline-none py-1"
              />
            </div>

            <!-- Format & ISBN Tags -->
            <div class="flex flex-wrap items-center gap-2 pt-2">
              <span class="px-2.5 py-1 bg-surface-container-low rounded-lg text-xs font-semibold text-on-surface-variant flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">devices</span>
                {{ formatLabel(editableBook.format) }}
              </span>
              <span v-if="editableBook.isbn" class="px-2.5 py-1 bg-surface-container-low rounded-lg text-xs text-outline font-mono">
                ISBN: {{ editableBook.isbn }}
              </span>
              <div class="flex items-center gap-1 px-2.5 py-1 bg-amber-50 rounded-lg text-xs font-bold text-amber-800 border border-amber-200" title="Preço do livro">
                <span class="text-amber-700">R$</span>
                <input
                  v-model.number="editableBook.price"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  class="w-16 bg-transparent outline-none font-bold text-amber-900 border-b border-dashed border-amber-400 focus:border-amber-600"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Cover Picker Gallery (when online covers found) -->
        <div v-if="availableCovers.length > 0" class="bg-blue-50/70 border border-blue-200 p-3.5 rounded-2xl animate-fade-in flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
              <span class="material-symbols-outlined text-accent text-sm">collections</span>
              Escolha uma capa encontrada na web:
            </span>
            <button @click="availableCovers = []" class="text-slate-400 hover:text-slate-600 text-xs">
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <div class="flex gap-2.5 overflow-x-auto pb-1 hide-scrollbar">
            <div
              v-for="(cUrl, idx) in availableCovers"
              :key="idx"
              @click="editableBook.coverUrl = cUrl; availableCovers = []"
              class="w-16 h-24 rounded-lg overflow-hidden shrink-0 border-2 cursor-pointer hover:scale-105 transition-all shadow-sm"
              :class="editableBook.coverUrl === cUrl ? 'border-accent ring-2 ring-accent/30' : 'border-slate-200 hover:border-slate-400'"
            >
              <img :src="cUrl" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <!-- Status Change Pills -->
        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold uppercase tracking-wider text-outline">Alterar Status</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="st in statusOptions"
              :key="st.value"
              type="button"
              @click="editableBook.status = st.value"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all',
                editableBook.status === st.value
                  ? 'bg-[#E2E8F0] text-[#1E293B] font-bold shadow-sm border border-slate-300'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              ]"
            >
              <span class="material-symbols-outlined text-sm">{{ st.icon }}</span>
              {{ st.label }}
            </button>
          </div>
        </div>

        <!-- Reading Progress Tracker (If Reading or Read) -->
        <div
          v-if="editableBook.status === 'reading' || editableBook.status === 'read'"
          class="bg-surface-container-low/70 border border-surface-variant p-4 rounded-xl flex flex-col gap-3"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-accent">auto_stories</span>
              <span class="font-bold text-sm text-on-surface">Progresso de Leitura</span>
            </div>
            <span class="text-sm font-extrabold text-accent">{{ progressPercent }}% Concluído</span>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
            <div
              class="bg-accent h-full rounded-full transition-all duration-300"
              :style="{ width: `${progressPercent}%` }"
            ></div>
          </div>

          <!-- Input Pages & Quick Actions -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div class="flex items-center gap-2 text-sm text-on-surface font-medium">
              <span>Página</span>
              <input
                v-model.number="editableBook.currentPage"
                type="number"
                min="0"
                :max="editableBook.totalPages || 9999"
                class="w-20 p-1.5 text-center font-bold bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-accent focus:ring-2 focus:ring-accent outline-none"
              />
              <span>de</span>
              <input
                v-model.number="editableBook.totalPages"
                type="number"
                min="1"
                placeholder="Total"
                class="w-20 p-1.5 text-center font-bold bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-on-surface focus:ring-2 focus:ring-accent outline-none"
              />
            </div>

            <!-- Quick Add Page Buttons -->
            <div class="flex items-center gap-1.5">
              <button
                type="button"
                @click="addPages(5)"
                class="px-2 py-1 bg-surface-container-lowest hover:bg-surface-container text-xs font-bold text-accent rounded-md border border-outline-variant/40"
              >
                +5 pág
              </button>
              <button
                type="button"
                @click="addPages(10)"
                class="px-2 py-1 bg-surface-container-lowest hover:bg-surface-container text-xs font-bold text-accent rounded-md border border-outline-variant/40"
              >
                +10 pág
              </button>
              <button
                type="button"
                @click="markCompleted"
                class="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold rounded-md transition-colors shadow-sm"
              >
                Concluir Livro
              </button>
            </div>
          </div>
        </div>

        <!-- Rating (Stars) -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold uppercase tracking-wider text-outline">Sua Avaliação</label>
          <div class="flex items-center gap-1">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="editableBook.rating = star"
              class="w-8 h-8 rounded-lg hover:bg-amber-500/10 flex items-center justify-center transition-transform hover:scale-110"
            >
              <span
                class="material-symbols-outlined text-2xl"
                :class="star <= editableBook.rating ? 'text-amber-500 fill' : 'text-outline-variant'"
              >
                star
              </span>
            </button>
            <span v-if="editableBook.rating > 0" class="text-xs font-bold text-amber-600 ml-2">
              {{ editableBook.rating }} de 5 estrelas
            </span>
            <button
              v-if="editableBook.rating > 0"
              @click="editableBook.rating = 0"
              class="text-[11px] text-outline hover:text-error ml-2 underline"
            >
              Limpar
            </button>
          </div>
        </div>

        <!-- Comparador de Preços em Lojas (Crawler APIFolhear) -->
        <BookPriceComparator
          :book="editableBook"
          @update-price="handlePriceUpdate"
        />

        <!-- Description / Sinopse -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold uppercase tracking-wider text-outline">Sinopse</label>
          <textarea
            v-model="editableBook.description"
            rows="3"
            placeholder="Sinopse do livro..."
            class="w-full p-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-accent focus:bg-white outline-none resize-none leading-relaxed"
          ></textarea>
        </div>

        <!-- Notes / Resenha -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold uppercase tracking-wider text-outline">Minhas Anotações &amp; Citações</label>
          <textarea
            v-model="editableBook.notes"
            rows="3"
            placeholder="Escreva seus pensamentos, melhores citações ou resenha..."
            class="w-full p-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-accent focus:bg-white outline-none resize-none leading-relaxed font-sans"
          ></textarea>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="p-4 sm:p-6 border-t border-surface-variant flex items-center justify-between bg-surface-container-low/40">
        <!-- Delete Button -->
        <button
          type="button"
          @click="confirmDelete"
          class="px-3.5 py-2 text-error hover:bg-error-container/20 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <span class="material-symbols-outlined text-base">delete</span>
          <span>Excluir Livro</span>
        </button>

        <!-- Save Button -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="store.closeModal"
            class="px-4 py-2 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Fechar
          </button>
          <button
            type="button"
            @click="saveChanges"
            class="px-5 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-slate-900 shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span class="material-symbols-outlined text-base">check</span>
            <span>Salvar Alterações</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useBookStore } from '@/store/bookStore'
import { googleBooksService } from '@/services/googleBooksService'
import BookCover from '@/components/books/BookCover.vue'
import BookPriceComparator from '@/components/books/BookPriceComparator.vue'

const store = useBookStore()

const book = computed(() => store.selectedBook)
const editableBook = ref({})
const availableCovers = ref([])
const isSearchingCovers = ref(false)

watch(book, (newVal) => {
  if (newVal) {
    editableBook.value = { ...newVal }
    availableCovers.value = []
  }
}, { immediate: true })

async function searchOnlineCovers() {
  if (!editableBook.value.title && !editableBook.value.isbn) return
  isSearchingCovers.value = true
  try {
    const list = await googleBooksService.searchAlternativeCovers(
      editableBook.value.title,
      editableBook.value.author,
      editableBook.value.isbn
    )
    if (list && list.length > 0) {
      availableCovers.value = list
      store.showNotification(`${list.length} opções de capa encontradas!`, 'info')
    } else {
      store.showNotification('Nenhuma capa adicional encontrada online para este livro.', 'info')
    }
  } catch (e) {
    store.showNotification('Erro ao buscar capas online.', 'error')
  } finally {
    isSearchingCovers.value = false
  }
}

function handleCoverUpload(event) {
  const file = event.target?.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    editableBook.value.coverUrl = e.target.result
    store.showNotification('Foto da capa atualizada com sucesso!', 'success')
  }
  reader.readAsDataURL(file)
}

const progressPercent = computed(() => {
  if (!editableBook.value.totalPages || editableBook.value.totalPages <= 0) return 0
  const percent = Math.round(((editableBook.value.currentPage || 0) / editableBook.value.totalPages) * 100)
  return Math.min(100, Math.max(0, percent))
})

const statusOptions = [
  { value: 'reading', label: 'Lendo Agora', icon: 'auto_stories' },
  { value: 'to-read', label: 'Quero Ler', icon: 'favorite' },
  { value: 'read', label: 'Lido e Concluído', icon: 'check_circle' },
  { value: 'physical', label: 'Acervo Físico', icon: 'home_storage' },
  { value: 'wishlist', label: 'Quero Comprar', icon: 'shopping_bag' },
]

const statusBadge = computed(() => {
  switch (editableBook.value.status) {
    case 'reading':
      return { label: 'Lendo Agora', icon: 'auto_stories', bgClass: 'bg-blue-50 text-accent border border-blue-200' }
    case 'read':
      return { label: 'Concluído', icon: 'check_circle', bgClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200' }
    case 'to-read':
      return { label: 'Quero Ler', icon: 'favorite', bgClass: 'bg-[#E2E8F0] text-[#1E293B] border border-slate-300' }
    case 'physical':
      return { label: 'Acervo Físico', icon: 'home_storage', bgClass: 'bg-surface-container text-on-surface border border-outline-variant' }
    case 'wishlist':
      return { label: 'Quero Comprar', icon: 'shopping_bag', bgClass: 'bg-amber-50 text-amber-800 border border-amber-200' }
    default:
      return { label: 'Livro', icon: 'book', bgClass: 'bg-surface-container text-on-surface' }
  }
})

function formatLabel(fmt) {
  if (fmt === 'ebook') return 'E-book'
  if (fmt === 'audiobook') return 'Audiolivro'
  return 'Livro Físico'
}

function toggleFavorite() {
  editableBook.value.favorite = !editableBook.value.favorite
}

function addPages(amount) {
  const current = Number(editableBook.value.currentPage || 0)
  const total = Number(editableBook.value.totalPages || 9999)
  editableBook.value.currentPage = Math.min(total, current + amount)
  if (editableBook.value.currentPage >= total) {
    editableBook.value.status = 'read'
  }
}

function markCompleted() {
  editableBook.value.status = 'read'
  editableBook.value.currentPage = editableBook.value.totalPages || editableBook.value.currentPage
  if (!editableBook.value.rating) editableBook.value.rating = 5
}

function handlePriceUpdate(newPrice) {
  editableBook.value.price = newPrice
  store.updateBook(editableBook.value.id, { price: newPrice })
}

function saveChanges() {
  store.updateBook(editableBook.value.id, editableBook.value)
  store.closeModal()
}

function confirmDelete() {
  if (confirm(`Tem certeza que deseja excluir "${editableBook.value.title}" da sua estante?`)) {
    store.deleteBook(editableBook.value.id)
  }
}
</script>
