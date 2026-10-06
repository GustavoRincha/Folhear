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
        <!-- Sub-navigation Filter Tabs for Owned Books -->
        <div class="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1">
          <button
            @click="store.setFilter('all')"
            :class="[
              'px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5',
              store.activeFilter === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            ]"
          >
            <span class="material-symbols-outlined text-sm">library_books</span>
            <span>Todos os Meus Livros</span>
            <span
              :class="[
                'px-1.5 py-0.2 rounded-full text-[10px]',
                store.activeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              ]"
            >
              {{ store.counts.owned }}
            </span>
          </button>

          <button
            @click="store.setFilter('reading')"
            :class="[
              'px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5',
              store.activeFilter === 'reading'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            ]"
          >
            <span class="material-symbols-outlined text-sm text-blue-400">auto_stories</span>
            <span>Lendo Agora</span>
            <span
              :class="[
                'px-1.5 py-0.2 rounded-full text-[10px]',
                store.activeFilter === 'reading' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
              ]"
            >
              {{ store.counts.reading }}
            </span>
          </button>

          <button
            @click="store.setFilter('read')"
            :class="[
              'px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5',
              store.activeFilter === 'read'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            ]"
          >
            <span class="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
            <span>Lidos</span>
            <span
              :class="[
                'px-1.5 py-0.2 rounded-full text-[10px]',
                store.activeFilter === 'read' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'
              ]"
            >
              {{ store.counts.read }}
            </span>
          </button>

          <button
            @click="store.setFilter('to-read')"
            :class="[
              'px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5',
              store.activeFilter === 'to-read'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            ]"
          >
            <span class="material-symbols-outlined text-sm text-rose-400">favorite</span>
            <span>Quero Ler</span>
            <span
              :class="[
                'px-1.5 py-0.2 rounded-full text-[10px]',
                store.activeFilter === 'to-read' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              ]"
            >
              {{ store.counts.toRead }}
            </span>
          </button>

          <button
            @click="store.setFilter('physical')"
            :class="[
              'px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5',
              store.activeFilter === 'physical'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            ]"
          >
            <span class="material-symbols-outlined text-sm text-amber-500">home_storage</span>
            <span>Acervo Físico</span>
            <span
              :class="[
                'px-1.5 py-0.2 rounded-full text-[10px]',
                store.activeFilter === 'physical' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              ]"
            >
              {{ store.counts.physical }}
            </span>
          </button>
        </div>

        <!-- Search and Category Controls -->
        <SearchFilterBar />

        <!-- Book Shelf / Grid Section -->
        <div>
          <!-- Section Title & Counts -->
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-headline-md font-headline-md text-on-surface font-bold">
              Catálogo de Livros
            </h3>
            <span class="text-label-sm font-label-sm text-outline font-semibold">
              {{ store.filteredOwnedBooks.length }} {{ store.filteredOwnedBooks.length === 1 ? 'volume' : 'volumes' }}
            </span>
          </div>

          <!-- Grid View Mode -->
          <div
            v-if="store.viewMode === 'grid' && store.filteredOwnedBooks.length > 0"
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
          >
            <BookCard
              v-for="book in store.filteredOwnedBooks"
              :key="book.id"
              :book="book"
            />
          </div>

          <!-- List View Mode -->
          <div
            v-else-if="store.viewMode === 'list' && store.filteredOwnedBooks.length > 0"
            class="flex flex-col gap-3"
          >
            <BookListItem
              v-for="book in store.filteredOwnedBooks"
              :key="book.id"
              :book="book"
            />
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-12 text-center flex flex-col items-center justify-center my-6"
          >
            <div class="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
              <span class="material-symbols-outlined text-3xl">auto_stories</span>
            </div>
            <h4 class="text-headline-md font-bold text-on-surface mb-2">Nenhum livro encontrado</h4>
            <p class="text-body-md text-on-surface-variant max-w-md mb-6">
              {{ store.searchQuery ? `Nenhum resultado para "${store.searchQuery}". Tente outro termo.` : 'Nenhum livro cadastrado nesta categoria ainda.' }}
            </p>
            <div class="flex flex-wrap gap-3 justify-center">
              <button
                v-if="store.searchQuery || store.activeFilter !== 'all' || store.selectedGenre !== 'Todos'"
                @click="resetFilters"
                class="px-4 py-2.5 rounded-lg border border-outline-variant text-on-surface text-sm font-bold hover:bg-surface-container transition-colors"
              >
                Limpar Filtros
              </button>
              <button
                @click="store.openModal('add')"
                class="px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-bold hover:bg-slate-900 shadow-md transition-all flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-base">add</span>
                Adicionar Novo Livro
              </button>
            </div>
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
import { onMounted } from 'vue'
import { useBookStore } from '@/store/bookStore'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import SearchFilterBar from '@/components/books/SearchFilterBar.vue'
import BookCard from '@/components/books/BookCard.vue'
import BookListItem from '@/components/books/BookListItem.vue'
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

function resetFilters() {
  store.setFilter('all')
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
