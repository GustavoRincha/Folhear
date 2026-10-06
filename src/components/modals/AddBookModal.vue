<template>
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
    <!-- Mobile Bottom-Sheet / Desktop Centered Card -->
    <div
      class="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] h-[92vh] sm:h-auto shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all select-none"
      style="padding-bottom: env(safe-area-inset-bottom, 0px);"
    >
      <!-- Modal Header -->
      <div class="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        <!-- Title & Mode Tabs -->
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-xl">
              {{ activeTab === 'scanner' ? 'barcode_scanner' : (activeTab === 'manual' ? 'edit_note' : 'library_add') }}
            </span>
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-bold text-[#0F172A] leading-tight">
              {{ activeTab === 'scanner' ? 'Escanear Código' : (activeTab === 'manual' ? 'Cadastro Manual' : 'Adicionar Livro') }}
            </h3>
            <p class="text-[11px] text-slate-400">
              {{ activeTab === 'scanner' ? 'Aponte a câmera para o código ISBN' : (activeTab === 'manual' ? 'Preencha os campos básicos' : 'Pesquise e adicione com 1 toque') }}
            </p>
          </div>
        </div>

        <!-- Mode Switcher Pills + Close Button -->
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            @click="switchTab(activeTab === 'search' ? 'manual' : 'search')"
            class="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
            :title="activeTab === 'search' ? 'Cadastrar livro manualmente' : 'Voltar para busca online'"
          >
            <span class="material-symbols-outlined text-sm">
              {{ activeTab === 'search' ? 'edit_note' : 'search' }}
            </span>
            <span>{{ activeTab === 'search' ? 'Manual' : 'Buscar' }}</span>
          </button>

          <button
            @click="handleCloseModal"
            class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#0F172A] flex items-center justify-center transition-colors"
            title="Fechar"
          >
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      </div>

      <!-- Quick Destination Status Selector (Sticky below header) -->
      <div class="px-4 py-2 bg-slate-50 border-b border-slate-100 shrink-0">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Salvar livro como:</span>
          <span class="text-[10px] text-accent font-bold">{{ currentTargetStatusLabel }}</span>
        </div>

        <!-- Compact Horizontal Status Buttons -->
        <div class="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-0.5">
          <button
            v-for="st in statusPills"
            :key="st.value"
            type="button"
            @click="targetStatus = st.value"
            :class="[
              'px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5',
              targetStatus === st.value
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            ]"
          >
            <span class="material-symbols-outlined text-sm" :class="st.iconColor">{{ st.icon }}</span>
            <span>{{ st.label }}</span>
          </button>
        </div>
      </div>

      <!-- TAB 1: FAST SEARCH VIEW (Default, streamlined) -->
      <div v-if="activeTab === 'search'" class="flex-1 flex flex-col overflow-hidden">
        <!-- Sticky Search Bar -->
        <div class="p-3 sm:p-4 bg-white border-b border-slate-100 shrink-0">
          <div class="relative flex items-center">
            <!-- Left Search Icon -->
            <span class="material-symbols-outlined absolute left-3.5 text-slate-400 text-xl pointer-events-none">
              search
            </span>

            <!-- Main Input -->
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Digite o título, autor ou ISBN..."
              class="w-full pl-11 pr-20 py-3 bg-slate-100 focus:bg-white border border-slate-200 rounded-2xl text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:ring-2 focus:ring-accent focus:border-accent transition-all outline-none"
              autofocus
            />

            <!-- Actions inside Search Bar: Clear button & Camera Scanner Trigger -->
            <div class="absolute right-2 flex items-center gap-1">
              <button
                v-if="searchQuery"
                @click="searchQuery = ''; searchResults = []"
                class="w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
                title="Limpar texto"
              >
                <span class="material-symbols-outlined text-base">close</span>
              </button>

              <button
                type="button"
                @click="switchTab('scanner')"
                class="w-8 h-8 rounded-xl bg-accent/15 hover:bg-accent/25 text-accent flex items-center justify-center transition-all active:scale-95"
                title="Abrir câmera para escanear código de barras"
              >
                <span class="material-symbols-outlined text-lg">barcode_scanner</span>
              </button>
            </div>
          </div>

          <!-- Quick Search Action Button on Mobile if typed -->
          <div v-if="searchQuery.trim()" class="mt-2 flex items-center justify-between">
            <span class="text-[11px] text-slate-400">Pressione enter ou:</span>
            <button
              @click="handleSearch"
              :disabled="isSearching"
              class="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-slate-900 transition-all flex items-center gap-1 shadow-sm active:scale-95 disabled:opacity-50"
            >
              <span v-if="isSearching" class="material-symbols-outlined animate-spin text-xs">progress_activity</span>
              <span v-else class="material-symbols-outlined text-xs">search</span>
              <span>Buscar Agora</span>
            </button>
          </div>
        </div>

        <!-- Scrollable Search Results Area -->
        <div class="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col gap-2.5">
          <!-- Loading State -->
          <div v-if="isSearching" class="py-16 flex flex-col items-center justify-center gap-3">
            <div class="w-12 h-12 rounded-full bg-blue-50 text-accent flex items-center justify-center shadow-inner">
              <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
            </div>
            <p class="text-xs font-bold text-slate-600">Buscando na biblioteca digital...</p>
          </div>

          <!-- Results List -->
          <template v-else-if="searchResults.length > 0">
            <div class="flex items-center justify-between px-1 pb-1">
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {{ searchResults.length }} livros encontrados
              </span>
              <span class="text-[10px] text-slate-400">
                Toque em <strong>Salvar</strong> para adicionar
              </span>
            </div>

            <!-- Single Result Card -->
            <div
              v-for="book in searchResults"
              :key="book.id"
              class="bg-white rounded-2xl p-3 border border-slate-200 hover:border-accent/60 shadow-sm flex items-center gap-3 transition-all"
            >
              <!-- Cover Thumbnail -->
              <div class="w-14 h-20 rounded-xl overflow-hidden shrink-0 shadow-sm bg-slate-100 border border-slate-200">
                <BookCover
                  :cover-url="book.coverUrl"
                  :title="book.title"
                  :author="book.author"
                  :genre="book.genre"
                  :isbn="book.isbn"
                  size="sm"
                  container-class="w-full h-full"
                />
              </div>

              <!-- Metadata -->
              <div class="flex-1 min-w-0 flex flex-col justify-center">
                <h4 class="font-bold text-xs sm:text-sm text-[#0F172A] leading-tight truncate" :title="book.title">
                  {{ book.title }}
                </h4>
                <p class="text-[11px] text-slate-500 font-medium truncate mt-0.5" :title="book.author">
                  {{ book.author || 'Autor desconhecido' }}
                </p>
                <div class="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                  <span v-if="book.totalPages" class="flex items-center gap-0.5">
                    <span class="material-symbols-outlined text-[11px]">auto_stories</span>
                    {{ book.totalPages }} págs
                  </span>
                  <span v-if="book.genre" class="truncate">• {{ book.genre }}</span>
                </div>
              </div>

              <!-- Action: 1-Click Save Button with success state -->
              <button
                type="button"
                @click="saveBookImmediately(book)"
                :disabled="savedBooksSet[book.id]"
                :class="[
                  'px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 shrink-0 active:scale-95',
                  savedBooksSet[book.id]
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-primary hover:bg-slate-900 text-white'
                ]"
              >
                <span class="material-symbols-outlined text-sm">
                  {{ savedBooksSet[book.id] ? 'check' : 'add' }}
                </span>
                <span>{{ savedBooksSet[book.id] ? 'Salvo!' : 'Salvar' }}</span>
              </button>
            </div>
          </template>

          <!-- Empty State: When searched but 0 found -->
          <div v-else-if="hasSearched" class="py-12 flex flex-col items-center justify-center text-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <span class="material-symbols-outlined text-2xl">search_off</span>
            </div>
            <div>
              <h4 class="text-sm font-bold text-[#0F172A]">Nenhum livro encontrado</h4>
              <p class="text-xs text-slate-400 mt-0.5">Tente pesquisar com menos palavras ou cadastre manualmente.</p>
            </div>
            <button
              type="button"
              @click="openManualWithTitle(searchQuery)"
              class="mt-2 px-4 py-2 rounded-xl bg-accent text-white font-bold text-xs shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <span class="material-symbols-outlined text-sm">edit</span>
              <span>Cadastrar "{{ searchQuery }}" Manualmente</span>
            </button>
          </div>

          <!-- Initial Peaceful State: Before Searching -->
          <div v-else class="py-14 flex flex-col items-center justify-center text-center gap-3 text-slate-400">
            <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shadow-inner">
              <span class="material-symbols-outlined text-3xl">menu_book</span>
            </div>
            <div>
              <p class="text-xs font-bold text-[#0F172A]">Pesquise pelo título, autor ou ISBN</p>
              <p class="text-[11px] text-slate-400 mt-0.5">A capa e os dados da obra são encontrados automaticamente.</p>
            </div>
            <button
              type="button"
              @click="switchTab('scanner')"
              class="mt-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <span class="material-symbols-outlined text-sm text-accent">barcode_scanner</span>
              <span>Ou use a Câmera para Escanear</span>
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 2: STREAMLINED CAMERA SCANNER VIEW -->
      <div v-else-if="activeTab === 'scanner'" class="flex-1 flex flex-col p-4 overflow-y-auto items-center gap-4">
        <!-- Live Camera Viewport -->
        <div class="relative w-full max-w-sm aspect-[4/3] bg-slate-950 rounded-2xl overflow-hidden shadow-xl border-2 border-slate-700 flex flex-col items-center justify-center">
          <video
            ref="videoElement"
            class="w-full h-full object-cover"
            autoplay
            playsinline
            muted
          ></video>

          <canvas ref="canvasElement" class="hidden"></canvas>

          <!-- Reticle & Laser overlay -->
          <div v-if="isCameraActive && !scannedFoundBook" class="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
            <div class="relative w-full max-w-[240px] h-28 border-2 border-accent/70 rounded-2xl flex items-center justify-center backdrop-brightness-110">
              <div class="w-full h-0.5 bg-accent shadow-[0_0_15px_#3B82F6] animate-bounce"></div>
            </div>
            <p class="text-[10px] font-semibold text-white/90 bg-black/60 px-3 py-1 rounded-full mt-2 backdrop-blur-sm">
              Alinhe as barras do ISBN no retângulo
            </p>
          </div>

          <!-- Camera Inactive / Permission Warning -->
          <div v-if="!isCameraActive" class="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-4 text-center text-white gap-2 z-10">
            <span class="material-symbols-outlined text-3xl text-accent">videocam_off</span>
            <p class="text-xs font-semibold">{{ cameraErrorMessage || 'Câmera Desconectada' }}</p>
            <div class="flex gap-2 mt-1">
              <button
                @click="startCameraScanner"
                class="px-3.5 py-1.5 bg-accent text-white rounded-xl text-xs font-bold shadow-md"
              >
                Ligar Câmera
              </button>
              <label class="px-3.5 py-1.5 bg-slate-800 text-slate-200 border border-slate-600 rounded-xl text-xs font-bold cursor-pointer">
                Tirar Foto
                <input type="file" accept="image/*" capture="environment" class="hidden" @change="handleImageFileUpload" />
              </label>
            </div>
          </div>
        </div>

        <!-- Scanned Book Found Card -->
        <div
          v-if="scannedFoundBook"
          class="w-full max-w-sm bg-white border-2 border-emerald-500/40 p-3.5 rounded-2xl flex items-center gap-3 shadow-md animate-fade-in"
        >
          <div class="w-14 h-20 rounded-lg overflow-hidden shrink-0 shadow-sm border border-slate-200">
            <BookCover
              :cover-url="scannedFoundBook.coverUrl"
              :title="scannedFoundBook.title"
              :author="scannedFoundBook.author"
              :genre="scannedFoundBook.genre"
              :isbn="scannedFoundBook.isbn"
              size="sm"
              container-class="w-full h-full"
            />
          </div>

          <div class="flex-1 min-w-0">
            <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Identificado!</span>
            <h4 class="font-bold text-xs sm:text-sm text-[#0F172A] truncate" :title="scannedFoundBook.title">
              {{ scannedFoundBook.title }}
            </h4>
            <p class="text-[11px] text-slate-500 truncate">{{ scannedFoundBook.author }}</p>

            <button
              @click="saveBookImmediately(scannedFoundBook)"
              class="mt-2 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm active:scale-95"
            >
              <span class="material-symbols-outlined text-sm">check</span>
              <span>Salvar Livro</span>
            </button>
          </div>
        </div>

        <!-- Manual ISBN Input fallback -->
        <div class="w-full max-w-sm flex gap-2 pt-1">
          <input
            v-model="manualIsbnQuery"
            @keyup.enter="handleManualIsbnLookup"
            type="text"
            placeholder="Ou digite o número do ISBN..."
            class="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            @click="handleManualIsbnLookup"
            :disabled="isLookingUpIsbn || !manualIsbnQuery.trim()"
            class="px-3.5 py-2 bg-primary text-white rounded-xl text-xs font-bold disabled:opacity-50 shrink-0"
          >
            Buscar
          </button>
        </div>
      </div>

      <!-- TAB 3: STREAMLINED MANUAL FORM (Simple & Mobile-Friendly) -->
      <form
        v-else-if="activeTab === 'manual'"
        @submit.prevent="handleManualSubmit"
        class="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4"
      >
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">Título do Livro *</label>
          <input
            v-model="manualForm.title"
            type="text"
            required
            placeholder="Ex: O Pequeno Príncipe"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#0F172A] focus:ring-2 focus:ring-accent focus:bg-white outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">Autor(a) *</label>
          <input
            v-model="manualForm.author"
            type="text"
            required
            placeholder="Ex: Antoine de Saint-Exupéry"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#0F172A] focus:ring-2 focus:ring-accent focus:bg-white outline-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Gênero</label>
            <input
              v-model="manualForm.genre"
              type="text"
              placeholder="Ex: Ficção"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#0F172A] outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Total de Páginas</label>
            <input
              v-model.number="manualForm.totalPages"
              type="number"
              min="0"
              placeholder="Ex: 240"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#0F172A] outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Formato</label>
            <select
              v-model="manualForm.format"
              class="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0F172A] outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="physical">📖 Livro Físico</option>
              <option value="ebook">📱 E-book</option>
              <option value="audiobook">🎧 Audiolivro</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Preço (Opcional)</label>
            <input
              v-model.number="manualForm.price"
              type="number"
              step="0.01"
              placeholder="R$ 0,00"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#0F172A] outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-auto pt-4 flex gap-2">
          <button
            type="button"
            @click="switchTab('search')"
            class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100"
          >
            Voltar
          </button>
          <button
            type="submit"
            class="flex-1 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-slate-900 shadow-md flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span class="material-symbols-outlined text-sm">save</span>
            <span>Salvar Livro</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBookStore } from '@/store/bookStore'
import { googleBooksService } from '@/services/googleBooksService'
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library'
import BookCover from '@/components/books/BookCover.vue'

const route = useRoute()
const store = useBookStore()

// Tab state: 'search' | 'scanner' | 'manual'
const activeTab = ref(store.activeModal === 'scanner' ? 'scanner' : 'search')

// Target Destination Status (applies to whatever book is saved)
const defaultInitialStatus = (route && route.path === '/comprar') ? 'wishlist' : 'to-read'
const targetStatus = ref(defaultInitialStatus)

const statusPills = [
  { value: 'reading', label: 'Lendo Agora', icon: 'auto_stories', iconColor: 'text-blue-400' },
  { value: 'to-read', label: 'Quero Ler', icon: 'favorite', iconColor: 'text-rose-400' },
  { value: 'read', label: 'Já Lido', icon: 'check_circle', iconColor: 'text-emerald-400' },
  { value: 'physical', label: 'Na Estante', icon: 'home_storage', iconColor: 'text-amber-500' },
  { value: 'wishlist', label: 'Comprar', icon: 'shopping_bag', iconColor: 'text-amber-400' },
]

const currentTargetStatusLabel = computed(() => {
  const found = statusPills.find(s => s.value === targetStatus.value)
  return found ? found.label : 'Na Estante'
})

// Search State
const searchQuery = ref('')
const isSearching = ref(false)
const hasSearched = ref(false)
const searchResults = ref([])
const savedBooksSet = reactive({})

// Camera Scanner States
const videoElement = ref(null)
const canvasElement = ref(null)
const isCameraActive = ref(false)
const cameraErrorMessage = ref('')
const lastScannedIsbn = ref('')
const isLookingUpIsbn = ref(false)
const scannedFoundBook = ref(null)
const manualIsbnQuery = ref('')

let activeMediaStream = null
let scanIntervalTimer = null
let isScanLoopRunning = false
let nativeBarcodeDetector = null
let zxingReader = null

// Manual Form State
const manualForm = reactive({
  title: '',
  author: '',
  genre: 'Ficção',
  format: 'physical',
  status: targetStatus.value,
  totalPages: null,
  currentPage: 0,
  price: null,
  coverUrl: '',
  description: '',
  notes: '',
  isbn: '',
})

function switchTab(tab) {
  if (activeTab.value === 'scanner' && tab !== 'scanner') {
    stopCameraScanner()
  }
  activeTab.value = tab
  if (tab === 'scanner') {
    setTimeout(startCameraScanner, 150)
  }
}

function handleCloseModal() {
  stopCameraScanner()
  store.closeModal()
}

// 1-Click Save Action
function saveBookImmediately(book) {
  store.addBook({
    title: book.title,
    author: book.author || 'Autor Desconhecido',
    genre: book.genre || 'Geral',
    format: 'physical',
    status: targetStatus.value,
    totalPages: book.totalPages || 0,
    currentPage: targetStatus.value === 'read' ? book.totalPages : 0,
    coverUrl: book.coverUrl,
    description: book.description || '',
    isbn: book.isbn || '',
    price: book.price || 0
  })

  savedBooksSet[book.id] = true

  // Short delay then close modal or allow user to see success
  setTimeout(() => {
    store.closeModal()
  }, 600)
}

// Search
async function handleSearch() {
  const query = searchQuery.value.trim()
  if (!query) return
  isSearching.value = true
  hasSearched.value = true

  try {
    const results = await googleBooksService.searchBooks(query, 'all')
    searchResults.value = results || []
  } catch (err) {
    console.error('Erro na pesquisa:', err)
    searchResults.value = []
    store.showNotification('Erro ao pesquisar livro online.', 'error')
  } finally {
    isSearching.value = false
  }
}

function openManualWithTitle(title) {
  manualForm.title = title || ''
  switchTab('manual')
}

function handleManualSubmit() {
  if (!manualForm.title.trim()) return

  store.addBook({
    ...manualForm,
    status: targetStatus.value,
    currentPage: targetStatus.value === 'read' ? manualForm.totalPages : (manualForm.currentPage || 0)
  })
  handleCloseModal()
}

// Sound chime on scan
function playBeep() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.12)
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + 0.16)
  } catch {
    // Áudio não suportado ou bloqueado pelo navegador
  }
}

function initZxingReader() {
  if (!zxingReader) {
    const hints = new Map()
    hints.set(DecodeHintType.TRY_HARDER, true)
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
    ])
    zxingReader = new BrowserMultiFormatReader(hints)
  }
  return zxingReader
}

async function startCameraScanner() {
  try {
    cameraErrorMessage.value = ''
    if ('BarcodeDetector' in window) {
      try {
        nativeBarcodeDetector = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a'] })
      } catch (e) {
        nativeBarcodeDetector = null
      }
    }

    const constraints = {
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    }

    activeMediaStream = await navigator.mediaDevices.getUserMedia(constraints)
    if (!videoElement.value) {
      setTimeout(startCameraScanner, 150)
      return
    }

    videoElement.value.srcObject = activeMediaStream
    await videoElement.value.play()

    isCameraActive.value = true
    isScanLoopRunning = true
    startContinuousFrameScanning()
  } catch (err) {
    console.warn('Falha na câmera:', err)
    isCameraActive.value = false
    cameraErrorMessage.value = 'Permissão de câmera não concedida'
  }
}

function startContinuousFrameScanning() {
  if (scanIntervalTimer) clearInterval(scanIntervalTimer)

  scanIntervalTimer = setInterval(async () => {
    if (!isScanLoopRunning || !isCameraActive.value || !videoElement.value) return
    if (videoElement.value.readyState < 2) return

    const video = videoElement.value

    if (nativeBarcodeDetector) {
      try {
        const barcodes = await nativeBarcodeDetector.detect(video)
        if (barcodes && barcodes.length > 0) {
          const raw = barcodes[0].rawValue?.trim()
          if (raw && raw !== lastScannedIsbn.value) {
            handleBarcodeDetected(raw)
            return
          }
        }
      } catch {
        // Frame não reconhecido pelo detector nativo
      }
    }

    // Fallback via ZXing lendo o canvas do frame
    try {
      if (canvasElement.value) {
        const canvas = canvasElement.value
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        const reader = initZxingReader()
        const result = reader.decodeFromCanvas(canvas)
        if (result && result.text && result.text !== lastScannedIsbn.value) {
          handleBarcodeDetected(result.text.trim())
        }
      }
    } catch {
      // Frame não continha código legível
    }
  }, 250)
}

async function handleBarcodeDetected(isbn) {
  playBeep()
  lastScannedIsbn.value = isbn
  isLookingUpIsbn.value = true
  scannedFoundBook.value = null

  try {
    const book = await googleBooksService.searchByIsbn(isbn)
    if (book) {
      scannedFoundBook.value = book
      store.showNotification(`Livro encontrado: "${book.title}"!`, 'success')
    } else {
      store.showNotification(`Código ${isbn} lido, mas não encontrado online.`, 'info')
    }
  } catch (err) {
    console.error('Erro na busca por ISBN:', err)
  } finally {
    isLookingUpIsbn.value = false
  }
}

function handleManualIsbnLookup() {
  if (!manualIsbnQuery.value.trim()) return
  handleBarcodeDetected(manualIsbnQuery.value.trim())
}

function handleImageFileUpload(event) {
  const file = event.target?.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    const img = new Image()
    img.onload = async () => {
      try {
        if (nativeBarcodeDetector) {
          const barcodes = await nativeBarcodeDetector.detect(img)
          if (barcodes && barcodes.length > 0) {
            handleBarcodeDetected(barcodes[0].rawValue.trim())
            return
          }
        }
        const zReader = initZxingReader()
        const result = await zReader.decodeFromImageElement(img)
        if (result && result.text) {
          handleBarcodeDetected(result.text.trim())
        }
      } catch (err) {
        store.showNotification('Não foi possível identificar o código nesta foto.', 'info')
      }
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

function stopCameraScanner() {
  isScanLoopRunning = false
  if (scanIntervalTimer) {
    clearInterval(scanIntervalTimer)
    scanIntervalTimer = null
  }
  if (activeMediaStream) {
    activeMediaStream.getTracks().forEach(track => track.stop())
    activeMediaStream = null
  }
  isCameraActive.value = false
}

onMounted(() => {
  if (activeTab.value === 'scanner') {
    setTimeout(startCameraScanner, 200)
  }
})

onUnmounted(() => {
  stopCameraScanner()
})
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
