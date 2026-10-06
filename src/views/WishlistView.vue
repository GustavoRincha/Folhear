<template>
  <div class="bg-background text-on-background font-sans min-h-screen flex flex-col md:flex-row pb-24 md:pb-8">
    <!-- Desktop Fixed Sidebar -->
    <AppSidebar />

    <!-- Main Content Area -->
    <main class="flex-1 md:ml-[260px] min-h-screen bg-background flex flex-col">
      <!-- Top Header -->
      <AppHeader />

      <!-- Main Container -->
      <div class="p-container-margin max-w-7xl w-full mx-auto flex flex-col gap-6">
        <!-- Financial Summary & Wishlist Banner -->
        <div class="relative bg-gradient-to-br from-amber-900 via-amber-950 to-stone-950 rounded-3xl p-6 sm:p-8 shadow-xl text-white border border-amber-800/40 overflow-hidden">
          <!-- Background Glow Pattern -->
          <div class="absolute right-0 top-0 w-3/4 h-full pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-amber-600 to-transparent"></div>

          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <span class="material-symbols-outlined text-amber-400 text-2xl sm:text-3xl">shopping_bag</span>
                <h2 class="text-xl sm:text-2xl font-bold font-headline-xl text-white tracking-tight">
                  Quero Comprar • Lista de Desejos
                </h2>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {{ store.counts.wishlist }} {{ store.counts.wishlist === 1 ? 'livro' : 'livros' }}
                </span>
              </div>
              <p class="text-xs sm:text-sm text-amber-200/80 max-w-xl leading-relaxed">
                Acompanhe os títulos que você planeja adquirir. Compare valores na Amazon, Estante Virtual e Mercado Livre e transfira para sua estante assim que comprar.
              </p>
            </div>

            <!-- Financial Summary Cards -->
            <div class="flex items-center gap-3 flex-wrap">
              <!-- Total Estimated Budget -->
              <div class="px-4 py-3 rounded-2xl bg-black/40 backdrop-blur-md border border-amber-500/30 flex items-center gap-3 shadow-inner">
                <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <span class="material-symbols-outlined text-xl">payments</span>
                </div>
                <div>
                  <span class="block text-[10px] uppercase font-bold text-amber-300/70 tracking-wider">Investimento Total</span>
                  <span class="text-base sm:text-lg font-black text-amber-200">
                    {{ formatCurrency(store.stats.totalWishlistValue) }}
                  </span>
                </div>
              </div>

              <!-- Action: Radar Modal Button -->
              <button
                @click="store.openModal('radar')"
                class="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-2xl font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 active:scale-95"
                title="Pesquisar ofertas online ao vivo"
              >
                <span class="material-symbols-outlined text-base">price_check</span>
                <span>Radar de Ofertas</span>
              </button>

              <!-- Action: Add to Wishlist Button -->
              <button
                @click="openAddWishlistModal"
                class="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs border border-white/20 transition-all flex items-center gap-2 active:scale-95"
              >
                <span class="material-symbols-outlined text-base">add</span>
                <span>Adicionar Desejo</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Filter & Search Controls Bar -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
          <!-- Search in Wishlist -->
          <div class="relative w-full sm:w-80">
            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar livro desejado..."
              class="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#0F172A] outline-none focus:ring-2 focus:ring-accent focus:bg-white"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <!-- Sort & Quick Controls -->
          <div class="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <!-- Genre Filter -->
            <select
              v-model="selectedGenre"
              class="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0F172A] outline-none cursor-pointer focus:ring-2 focus:ring-accent"
            >
              <option v-for="g in store.genres" :key="g" :value="g">
                {{ g === 'Todos' ? 'Todos os Gêneros' : g }}
              </option>
            </select>

            <!-- Sort By Price or Title -->
            <select
              v-model="sortBy"
              class="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0F172A] outline-none cursor-pointer focus:ring-2 focus:ring-accent"
            >
              <option value="modified">Mais Recentes</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="title">Título (A-Z)</option>
            </select>
          </div>
        </div>

        <!-- Wishlist Books Cards Grid -->
        <div v-if="store.filteredWishlistBooks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div
            v-for="book in store.filteredWishlistBooks"
            :key="book.id"
            class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
          >
            <!-- Card Top: Cover + Meta Info -->
            <div class="flex gap-4 items-start">
              <!-- Book Cover -->
              <div
                @click="openDetails(book)"
                class="w-20 sm:w-24 aspect-[2/3] rounded-xl overflow-hidden shrink-0 shadow-md bg-slate-100 border border-slate-200 cursor-pointer group-hover:scale-105 transition-transform"
              >
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

              <!-- Details -->
              <div class="flex-1 min-w-0 flex flex-col">
                <div class="flex items-center justify-between gap-1 mb-1">
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                    Desejo
                  </span>
                  <span v-if="book.genre" class="text-xs text-slate-400 font-medium truncate">
                    {{ book.genre }}
                  </span>
                </div>

                <h4
                  @click="openDetails(book)"
                  class="font-bold text-sm sm:text-base text-[#0F172A] leading-snug line-clamp-2 cursor-pointer hover:text-accent transition-colors"
                  :title="book.title"
                >
                  {{ book.title }}
                </h4>

                <p class="text-xs text-slate-500 font-medium truncate mt-0.5" :title="book.author">
                  {{ book.author }}
                </p>

                <!-- Registered Price Tag -->
                <div class="mt-3 flex items-baseline gap-1.5">
                  <span class="text-xs text-slate-400 font-medium">Preço Estimado:</span>
                  <span class="text-base sm:text-lg font-black text-amber-700">
                    {{ formatPrice(book.price) }}
                  </span>
                </div>

                <p v-if="book.notes" class="text-[11px] text-slate-400 italic line-clamp-1 mt-1">
                  "{{ book.notes }}"
                </p>
              </div>
            </div>

            <!-- Card Bottom: Primary Actions -->
            <div class="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <!-- Big Celebrate Button: "Comprei! Mover para a Estante" -->
              <button
                type="button"
                @click="markAsPurchased(book)"
                class="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                title="Marcar como adquirido e mover para a Estante Virtual"
              >
                <span class="material-symbols-outlined text-base">verified</span>
                <span>Comprei! Mover para a Estante</span>
              </button>

              <!-- Secondary Actions Row: Radar + Details + Delete -->
              <div class="flex items-center justify-between gap-1 pt-0.5">
                <button
                  type="button"
                  @click="openPriceComparator(book)"
                  class="flex-1 py-1.5 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200/80 transition-colors flex items-center justify-center gap-1"
                  title="Ver cotações deste livro na Amazon, Estante Virtual e Mercado Livre"
                >
                  <span class="material-symbols-outlined text-sm text-amber-600">price_check</span>
                  <span>Cotar Lojas</span>
                </button>

                <button
                  type="button"
                  @click="openDetails(book)"
                  class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  title="Editar dados do livro"
                >
                  <span class="material-symbols-outlined text-sm">edit</span>
                </button>

                <button
                  type="button"
                  @click="confirmRemove(book)"
                  class="px-2.5 py-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                  title="Remover da lista de compras"
                >
                  <span class="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty Wishlist State -->
        <div
          v-else
          class="bg-white border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center my-6 shadow-sm"
        >
          <div class="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 shadow-inner">
            <span class="material-symbols-outlined text-3xl">shopping_cart_checkout</span>
          </div>
          <h4 class="text-headline-md font-bold text-[#0F172A] mb-1">
            {{ store.searchQuery ? 'Nenhum desejo encontrado para a busca' : 'Sua lista de desejos está vazia' }}
          </h4>
          <p class="text-body-md text-slate-500 max-w-md mb-6 text-sm leading-relaxed">
            Adicione livros que você quer comprar para acompanhar cotações nas lojas ou use o Radar de Preços para descobrir promoções.
          </p>
          <div class="flex flex-wrap gap-3 justify-center">
            <button
              v-if="store.searchQuery || store.selectedGenre !== 'Todos'"
              @click="resetFilters"
              class="px-4 py-2.5 rounded-xl border border-slate-200 text-[#0F172A] text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Limpar Filtros
            </button>
            <button
              @click="store.openModal('radar')"
              class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-black shadow-md transition-all flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-base">price_check</span>
              Pesquisar no Radar
            </button>
            <button
              @click="openAddWishlistModal"
              class="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-slate-900 shadow-md transition-all flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-base">add</span>
              Cadastrar Novo Desejo
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <BottomNav />

    <!-- Modals -->
    <AddBookModal v-if="store.activeModal === 'add' || store.activeModal === 'scanner'" />
    <BookDetailsModal v-if="store.activeModal === 'details'" />
    <StatsModal v-if="store.activeModal === 'stats'" />
    <BackupModal v-if="store.activeModal === 'backup'" />
    <PriceRadarModal v-if="store.activeModal === 'radar'" />
    <NavigationMenuModal v-if="store.activeModal === 'menu'" />
    <ProfileModal v-if="store.activeModal === 'profile'" />

    <!-- Toast Notification -->
    <transition name="fade">
      <div
        v-if="store.notification"
        class="fixed bottom-24 md:bottom-8 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium border border-slate-700 animate-slide-up"
      >
        <span
          class="material-symbols-outlined text-lg"
          :class="store.notification.type === 'error' ? 'text-red-400' : 'text-emerald-400'"
        >
          {{ store.notification.type === 'error' ? 'error' : 'check_circle' }}
        </span>
        <span>{{ store.notification.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useBookStore } from '@/store/bookStore'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import BookCover from '@/components/books/BookCover.vue'
import AddBookModal from '@/components/modals/AddBookModal.vue'
import BookDetailsModal from '@/components/modals/BookDetailsModal.vue'
import StatsModal from '@/components/modals/StatsModal.vue'
import BackupModal from '@/components/modals/BackupModal.vue'
import PriceRadarModal from '@/components/modals/PriceRadarModal.vue'
import NavigationMenuModal from '@/components/modals/NavigationMenuModal.vue'
import ProfileModal from '@/components/modals/ProfileModal.vue'

const store = useBookStore()

onMounted(() => {
  store.initStore()
})

const searchQuery = computed({
  get: () => store.searchQuery,
  set: (val) => store.setSearchQuery(val)
})

const selectedGenre = computed({
  get: () => store.selectedGenre,
  set: (val) => store.setGenre(val)
})

const sortBy = computed({
  get: () => store.sortBy,
  set: (val) => store.setSortBy(val)
})

function formatCurrency(val) {
  return `R$ ${Number(val || 0).toFixed(2).replace('.', ',')}`
}

function formatPrice(val) {
  if (!val || val <= 0) return 'Preço a pesquisar'
  return `R$ ${Number(val).toFixed(2).replace('.', ',')}`
}

function openDetails(book) {
  store.openModal('details', book)
}

function openPriceComparator(book) {
  store.openModal('details', book)
}

function openAddWishlistModal() {
  store.openModal('add')
}

function markAsPurchased(book) {
  store.moveToOwned(book.id, 'physical')
}

function confirmRemove(book) {
  if (confirm(`Remover "${book.title}" da sua lista de compras?`)) {
    store.deleteBook(book.id)
  }
}

function resetFilters() {
  store.setSearchQuery('')
  store.setGenre('Todos')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
