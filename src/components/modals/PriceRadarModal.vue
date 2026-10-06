<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
    <div class="bg-surface-container-lowest rounded-2xl w-full max-w-3xl max-h-[92vh] shadow-2xl border border-outline-variant/60 flex flex-col overflow-hidden">
      <!-- Modal Header -->
      <div class="p-4 sm:p-6 border-b border-surface-variant flex items-center justify-between bg-surface-container-low/40 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shrink-0">
            <span class="material-symbols-outlined text-2xl">price_check</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base sm:text-lg font-bold text-on-surface">Radar de Preços & Ofertas</h3>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800">
                Ao Vivo
              </span>
            </div>
            <p class="text-xs text-outline">
              Pesquise livros de interesse e compare valores na Estante Virtual, Amazon e Mercado Livre
            </p>
          </div>
        </div>

        <button
          @click="store.closeModal"
          class="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors"
          title="Fechar"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Search & Filters Section -->
      <div class="p-4 sm:p-6 pb-3 border-b border-surface-variant bg-surface-container-lowest flex flex-col gap-3 shrink-0">
        <!-- Search Input Bar -->
        <div class="flex flex-col sm:flex-row gap-2">
          <div class="relative flex-1">
            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Digite o título, autor ou ISBN (ex: Duna, 1984, Sapiens)..."
              class="w-full pl-11 pr-10 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-sm text-on-surface placeholder:text-outline focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''; searchResults = []"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface w-5 h-5 flex items-center justify-center"
            >
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <button
            @click="handleSearch"
            :disabled="isSearching || !searchQuery.trim()"
            class="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-5 py-3 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-all shrink-0 shadow-md active:scale-95"
          >
            <span v-if="isSearching" class="material-symbols-outlined animate-spin text-base">progress_activity</span>
            <span v-else class="material-symbols-outlined text-base">search</span>
            <span>Buscar Ofertas</span>
          </button>
        </div>

        <!-- Quick Suggestions Chips -->
        <div class="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1 text-xs">
          <span class="text-[11px] font-bold text-outline uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <span class="material-symbols-outlined text-xs text-amber-600">trending_up</span>
            Sugestões:
          </span>
          <button
            v-for="sug in suggestions"
            :key="sug"
            @click="applySuggestion(sug)"
            class="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-surface-container border border-outline-variant/50 text-on-surface-variant font-medium text-xs whitespace-nowrap transition-colors"
          >
            {{ sug }}
          </button>
        </div>
      </div>

      <!-- Modal Body (Results Area) -->
      <div class="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-4">
        <!-- State 1: Searching Catalog -->
        <div v-if="isSearching" class="py-16 flex flex-col items-center justify-center gap-3">
          <div class="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
            <span class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
          </div>
          <p class="text-sm font-semibold text-on-surface">Procurando edições do livro...</p>
          <span class="text-xs text-outline">Consultando bibliotecas e bases digitais</span>
        </div>

        <!-- State 2: No search performed yet (Welcome Banner) -->
        <div v-else-if="!hasSearched" class="py-12 flex flex-col items-center justify-center text-center gap-4 max-w-md mx-auto">
          <div class="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
            <span class="material-symbols-outlined text-3xl">shopping_cart_checkout</span>
          </div>
          <div>
            <h4 class="text-base font-bold text-on-surface mb-1">Encontre o menor preço para a sua próxima leitura</h4>
            <p class="text-xs text-on-surface-variant leading-relaxed">
              Pesquise qualquer obra para consultar preços simultâneos em sebos virtuais e grandes e-commerces. Salve diretamente na sua lista de compras ou na estante com um clique.
            </p>
          </div>
          <div class="grid grid-cols-3 gap-2 w-full pt-2 text-[11px] font-semibold text-outline">
            <div class="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col items-center gap-1">
              <span class="material-symbols-outlined text-amber-600 text-lg">menu_book</span>
              <span>Estante Virtual</span>
            </div>
            <div class="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col items-center gap-1">
              <span class="material-symbols-outlined text-amber-600 text-lg">shopping_bag</span>
              <span>Amazon Brasil</span>
            </div>
            <div class="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col items-center gap-1">
              <span class="material-symbols-outlined text-amber-600 text-lg">local_shipping</span>
              <span>Mercado Livre</span>
            </div>
          </div>
        </div>

        <!-- State 3: Search executed with 0 results -->
        <div v-else-if="searchResults.length === 0" class="py-14 text-center flex flex-col items-center justify-center gap-3">
          <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">search_off</span>
          </div>
          <h4 class="text-sm font-bold text-on-surface">Nenhum livro encontrado</h4>
          <p class="text-xs text-outline max-w-xs">
            Tente pesquisar apenas pelo nome do livro ou pelo código ISBN sem pontuação.
          </p>
        </div>

        <!-- State 4: Book Results List with Price Panels -->
        <div v-else class="flex flex-col gap-4">
          <div class="flex items-center justify-between px-1">
            <span class="text-xs font-bold uppercase tracking-wider text-outline">
              {{ searchResults.length }} {{ searchResults.length === 1 ? 'edição encontrada' : 'edições encontradas' }}
            </span>
            <span class="text-[11px] text-outline">
              Clique em <strong>Consultar Preços</strong> para cotar nas lojas
            </span>
          </div>

          <!-- Book Card Item -->
          <div
            v-for="item in searchResults"
            :key="item.id"
            class="bg-surface-container-lowest border rounded-2xl p-4 transition-all shadow-sm hover:shadow-md flex flex-col gap-3"
            :class="[
              expandedBookId === item.id ? 'border-amber-400 ring-1 ring-amber-400/30' : 'border-outline-variant/50'
            ]"
          >
            <!-- Top Section: Book Overview -->
            <div class="flex gap-3.5 items-start">
              <!-- Book Cover -->
              <div class="w-16 sm:w-20 aspect-[2/3] rounded-lg overflow-hidden shrink-0 shadow-sm border border-outline-variant/40 bg-slate-100">
                <BookCover
                  :cover-url="item.coverUrl"
                  :title="item.title"
                  :author="item.author"
                  :genre="item.genre"
                  :isbn="item.isbn"
                  size="sm"
                  container-class="w-full h-full"
                />
              </div>

              <!-- Book Info -->
              <div class="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between gap-2">
                    <h4 class="font-bold text-sm sm:text-base text-on-surface line-clamp-2 leading-snug">
                      {{ item.title }}
                    </h4>
                    <!-- Already in Shelf Badge -->
                    <span
                      v-if="isBookInLibrary(item)"
                      class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 shrink-0"
                      title="Este livro já faz parte da sua biblioteca"
                    >
                      <span class="material-symbols-outlined text-xs">bookmark_added</span>
                      <span>Na Estante</span>
                    </span>
                  </div>

                  <p class="text-xs text-on-surface-variant font-medium mt-0.5 line-clamp-1">
                    {{ item.author }}
                  </p>

                  <div class="flex flex-wrap items-center gap-2 mt-2">
                    <span v-if="item.publishedDate" class="text-[11px] px-2 py-0.5 rounded bg-surface-container-low text-outline">
                      {{ item.publishedDate }}
                    </span>
                    <span v-if="item.isbn" class="text-[11px] px-2 py-0.5 rounded bg-surface-container-low font-mono text-outline">
                      ISBN: {{ item.isbn }}
                    </span>
                    <span v-if="item.publisher" class="text-[11px] px-2 py-0.5 rounded bg-surface-container-low text-outline line-clamp-1 max-w-[140px]">
                      {{ item.publisher }}
                    </span>
                  </div>
                </div>

                <!-- Price Trigger Button (when not yet fetched) -->
                <div class="pt-3 flex items-center justify-between gap-2 flex-wrap">
                  <button
                    type="button"
                    @click="togglePriceCheck(item)"
                    :disabled="loadingPriceId === item.id"
                    class="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                    :class="[
                      expandedBookId === item.id
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white'
                    ]"
                  >
                    <span v-if="loadingPriceId === item.id" class="material-symbols-outlined animate-spin text-sm">
                      progress_activity
                    </span>
                    <span v-else class="material-symbols-outlined text-sm">
                      {{ expandedBookId === item.id ? 'expand_less' : 'price_check' }}
                    </span>
                    <span>
                      {{ loadingPriceId === item.id ? 'Cotando Preços...' : (expandedBookId === item.id ? 'Ocultar Ofertas' : 'Consultar Preços') }}
                    </span>
                  </button>

                  <!-- Preview of lowest price if already fetched -->
                  <div v-if="priceCache[item.id] && priceCache[item.id].lowestPrice" class="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">savings</span>
                    <span>A partir de {{ priceCache[item.id].lowestPriceFormatted }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Price Breakdown Panel (when expanded) -->
            <div
              v-if="expandedBookId === item.id"
              class="pt-3 border-t border-surface-variant/60 flex flex-col gap-3 animate-fade-in"
            >
              <!-- Loading spinner for prices -->
              <div v-if="loadingPriceId === item.id" class="py-6 flex flex-col items-center justify-center gap-2">
                <span class="material-symbols-outlined animate-spin text-xl text-amber-600">progress_activity</span>
                <span class="text-xs text-outline">Rastreando valores na Estante Virtual, Amazon e Mercado Livre...</span>
              </div>

              <!-- Prices Loaded -->
              <div v-else-if="priceCache[item.id]" class="flex flex-col gap-3">
                <!-- Best Deal Alert Banner -->
                <div
                  v-if="priceCache[item.id].lowestPrice"
                  class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                >
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-base">savings</span>
                    </div>
                    <div>
                      <div class="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        Menor Preço:
                        <span class="text-sm font-extrabold text-emerald-700">{{ priceCache[item.id].lowestPriceFormatted }}</span>
                      </div>
                      <p class="text-[11px] text-emerald-800">
                        Melhor opção encontrada na <strong>{{ priceCache[item.id].bestDealStore }}</strong>
                      </p>
                    </div>
                  </div>

                  <!-- Quick Add to Wishlist Button with Best Price -->
                  <button
                    type="button"
                    @click="addBookWithPrice(item, 'wishlist')"
                    class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm shrink-0 active:scale-95"
                    title="Adicionar à lista Quero Comprar com este valor"
                  >
                    <span class="material-symbols-outlined text-xs">bookmark_add</span>
                    <span>Salvar no "Quero Comprar"</span>
                  </button>
                </div>

                <!-- Stores Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    v-for="(st, sIdx) in priceCache[item.id].results"
                    :key="sIdx"
                    class="p-3 rounded-xl border flex flex-col justify-between gap-2 transition-all hover:shadow-sm"
                    :class="[
                      st.bestDeal
                        ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-300/40'
                        : 'bg-surface-container-low/40 border-outline-variant/50'
                    ]"
                  >
                    <div class="flex items-start justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-base text-outline">{{ st.storeIcon || 'store' }}</span>
                        <div>
                          <div class="text-xs font-bold text-on-surface flex items-center gap-1">
                            {{ st.store }}
                            <span
                              v-if="st.bestDeal"
                              class="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded uppercase tracking-wider"
                            >
                              Menor Preço
                            </span>
                          </div>
                          <span class="text-[11px] text-outline line-clamp-1">{{ st.condition }}</span>
                        </div>
                      </div>

                      <div class="text-right shrink-0">
                        <div
                          v-if="st.price !== null"
                          class="text-sm font-extrabold"
                          :class="st.bestDeal ? 'text-emerald-700' : 'text-on-surface'"
                        >
                          {{ st.priceFormatted }}
                        </div>
                        <div v-else class="text-[11px] font-semibold text-outline">
                          {{ st.priceFormatted || 'Consultar' }}
                        </div>
                      </div>
                    </div>

                    <!-- Store Card Footer Link -->
                    <div class="flex items-center justify-between pt-1 border-t border-surface-variant/40 mt-1">
                      <span class="text-[10px] text-outline truncate max-w-[140px]">{{ st.note || 'Oferta externa' }}</span>
                      <a
                        :href="st.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                        :class="[
                          st.bestDeal
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                            : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface'
                        ]"
                      >
                        <span>Ver Oferta</span>
                        <span class="material-symbols-outlined text-xs">open_in_new</span>
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Add to Other Statuses Options -->
                <div class="pt-2 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <span class="text-[11px] font-semibold text-outline">Ou adicione à estante como:</span>
                  <div class="flex items-center gap-1.5">
                    <button
                      type="button"
                      @click="addBookWithPrice(item, 'to-read')"
                      class="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-medium transition-colors"
                    >
                      Quero Ler
                    </button>
                    <button
                      type="button"
                      @click="addBookWithPrice(item, 'reading')"
                      class="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-medium transition-colors"
                    >
                      Lendo Agora
                    </button>
                    <button
                      type="button"
                      @click="addBookWithPrice(item, 'physical')"
                      class="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-medium transition-colors"
                    >
                      Acervo Físico
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-4 sm:p-6 border-t border-surface-variant flex items-center justify-between bg-surface-container-low/40 shrink-0">
        <div class="flex items-center gap-1.5 text-xs text-outline">
          <span class="material-symbols-outlined text-sm text-amber-600">info</span>
          <span>Valores cotados em tempo real na APIFolhear</span>
        </div>

        <button
          type="button"
          @click="store.closeModal"
          class="px-5 py-2 rounded-xl text-xs font-bold bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useBookStore } from '@/store/bookStore'
import { googleBooksService } from '@/services/googleBooksService'
import { priceCrawlerService } from '@/services/priceCrawlerService'
import BookCover from '@/components/books/BookCover.vue'

const store = useBookStore()

const searchQuery = ref('')
const isSearching = ref(false)
const hasSearched = ref(false)
const searchResults = ref([])

const expandedBookId = ref(null)
const loadingPriceId = ref(null)
const priceCache = reactive({})

const suggestions = [
  'Duna',
  '1984',
  'Hábitos Atômicos',
  'O Pequeno Príncipe',
  'Sapiens',
  'Flores para Algernon',
  'O Homem e Seus Símbolos'
]

function applySuggestion(title) {
  searchQuery.value = title
  handleSearch()
}

async function handleSearch() {
  const query = searchQuery.value.trim()
  if (!query) return

  isSearching.value = true
  hasSearched.value = true
  expandedBookId.value = null

  try {
    const list = await googleBooksService.searchBooks(query, 'all')
    searchResults.value = list || []

    // Se houver apenas 1 resultado ou resultado exato, já abre a cotação automaticamente!
    if (searchResults.value.length === 1) {
      togglePriceCheck(searchResults.value[0])
    }
  } catch (error) {
    console.error('Erro na pesquisa de livros:', error)
    store.showNotification('Erro ao buscar livros online.', 'error')
  } finally {
    isSearching.value = false
  }
}

async function togglePriceCheck(book) {
  if (expandedBookId.value === book.id) {
    expandedBookId.value = null
    return
  }

  expandedBookId.value = book.id

  // Se já tiver em cache, não faz requisição de novo
  if (priceCache[book.id]) {
    return
  }

  loadingPriceId.value = book.id

  try {
    const result = await priceCrawlerService.getBookPrices({
      isbn: book.isbn,
      title: book.title,
      author: book.author
    })
    priceCache[book.id] = result
  } catch (e) {
    console.error('Erro ao cotar preços:', e)
  } finally {
    loadingPriceId.value = null
  }
}

function isBookInLibrary(item) {
  return store.books.some(b => {
    if (item.isbn && b.isbn && item.isbn === b.isbn) return true
    if (b.title && item.title && b.title.toLowerCase().trim() === item.title.toLowerCase().trim()) return true
    return false
  })
}

function addBookWithPrice(item, status = 'wishlist') {
  const cachedPrice = priceCache[item.id]?.lowestPrice || 0

  const newBook = store.addBook({
    title: item.title,
    author: item.author,
    genre: item.genre || 'Geral',
    format: 'physical',
    status: status,
    price: Number(cachedPrice) || 0,
    coverUrl: item.coverUrl,
    description: item.description || '',
    isbn: item.isbn || '',
    totalPages: item.totalPages || 0
  })

  const statusLabel = status === 'wishlist' ? 'Quero Comprar' : (status === 'to-read' ? 'Quero Ler' : 'sua estante')
  const priceMsg = cachedPrice > 0 ? ` por R$ ${Number(cachedPrice).toFixed(2)}` : ''
  store.showNotification(`"${newBook.title}" salvo em "${statusLabel}"${priceMsg}!`, 'success')
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
