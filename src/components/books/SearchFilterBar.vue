<template>
  <div class="relative w-full">
    <!-- Main Minimalist Bar -->
    <div
      class="bg-white rounded-2xl shadow-sm border transition-all duration-200 flex items-center px-3 py-2 sm:py-2.5 gap-2"
      :class="isFocused ? 'border-accent ring-2 ring-accent/20 shadow-md' : 'border-slate-200 hover:border-slate-300'"
    >
      <!-- Search Icon -->
      <span
        class="material-symbols-outlined text-xl pl-1 sm:pl-2 transition-colors shrink-0"
        :class="isFocused ? 'text-accent' : 'text-slate-400'"
      >
        search
      </span>

      <!-- Search Input -->
      <input
        v-model="searchQuery"
        @focus="isFocused = true"
        @blur="isFocused = false"
        type="text"
        placeholder="Buscar por título, autor, gênero, ISBN..."
        class="flex-1 min-w-0 bg-transparent text-sm text-[#0F172A] placeholder:text-slate-400 outline-none font-medium"
      />

      <!-- Clear Button (when text is typed) -->
      <button
        v-if="searchQuery"
        @click="searchQuery = ''"
        class="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition-colors shrink-0"
        title="Limpar busca"
      >
        <span class="material-symbols-outlined text-base">close</span>
      </button>

      <!-- Active Genre Tag (Quick pill inside bar on desktop) -->
      <div v-if="store.selectedGenre !== 'Todos'" class="hidden sm:flex items-center gap-1.5 shrink-0">
        <span class="px-2.5 py-1 rounded-lg bg-[#E2E8F0] text-[#1E293B] text-xs font-bold flex items-center gap-1">
          <span>{{ store.selectedGenre }}</span>
          <button @click.stop="store.setGenre('Todos')" class="hover:text-red-500 flex items-center">
            <span class="material-symbols-outlined text-xs">close</span>
          </button>
        </span>
      </div>

      <!-- Divider -->
      <div class="h-6 w-px bg-slate-200 shrink-0"></div>

      <!-- Filter & Sort Popover Trigger Button -->
      <div class="relative shrink-0" ref="popoverRef">
        <button
          @click="togglePopover"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
            isPopoverOpen || hasActiveFilter
              ? 'bg-[#E2E8F0] text-[#1E293B] shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]'
          ]"
          title="Filtros e Ordenação"
        >
          <span class="material-symbols-outlined text-lg" :class="{ 'text-accent': hasActiveFilter }">tune</span>
          <span class="hidden sm:inline">Filtros</span>
          <span
            v-if="activeFilterCount > 0"
            class="w-4 h-4 rounded-full bg-accent text-white text-[10px] flex items-center justify-center font-black"
          >
            {{ activeFilterCount }}
          </span>
          <span class="material-symbols-outlined text-sm transition-transform duration-200" :class="{ 'rotate-180': isPopoverOpen }">
            expand_more
          </span>
        </button>

        <!-- Floating Popover Menu -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0 -translate-y-2"
          enter-to-class="transform scale-100 opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform scale-100 opacity-100 translate-y-0"
          leave-to-class="transform scale-95 opacity-0 -translate-y-2"
        >
          <div
            v-if="isPopoverOpen"
            class="absolute right-0 top-full mt-3 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 z-50 flex flex-col gap-4 text-left"
          >
            <!-- Popover Header -->
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-accent text-xl">tune</span>
                <span class="font-bold text-sm text-[#0F172A]">Filtros &amp; Ordenação</span>
              </div>
              <button
                v-if="hasActiveFilter"
                @click="resetAllFilters"
                class="text-xs text-accent hover:underline font-bold"
              >
                Limpar
              </button>
            </div>

            <!-- Gênero Section -->
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Filtrar por Gênero</label>
              <div class="relative">
                <select
                  v-model="selectedGenre"
                  class="w-full py-2.5 pl-3.5 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0F172A] focus:ring-2 focus:ring-accent focus:bg-white outline-none appearance-none cursor-pointer"
                >
                  <option v-for="g in store.genres" :key="g" :value="g">
                    {{ g === 'Todos' ? 'Todos os Gêneros' : g }}
                  </option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">
                  expand_more
                </span>
              </div>
            </div>

            <!-- Ordenar Section -->
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Ordenar Resultados</label>
              <div class="grid grid-cols-1 gap-1.5">
                <button
                  v-for="opt in sortOptions"
                  :key="opt.value"
                  @click="sortBy = opt.value"
                  :class="[
                    'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left',
                    sortBy === opt.value
                      ? 'bg-[#E2E8F0] text-[#1E293B] font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  ]"
                >
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-base text-slate-400">{{ opt.icon }}</span>
                    <span>{{ opt.label }}</span>
                  </div>
                  <span v-if="sortBy === opt.value" class="material-symbols-outlined text-accent text-sm font-bold">
                    check
                  </span>
                </button>
              </div>
            </div>

            <!-- Footer Close button -->
            <div class="pt-2 border-t border-slate-100 flex justify-end">
              <button
                @click="isPopoverOpen = false"
                class="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors shadow-sm text-center"
              >
                Concluir
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- View Mode Toggle (Grid / List) -->
      <div class="hidden sm:flex items-center gap-1 shrink-0">
        <button
          @click="store.setViewMode('grid')"
          :class="[
            'w-8 h-8 rounded-xl flex items-center justify-center transition-all',
            store.viewMode === 'grid'
              ? 'bg-[#E2E8F0] text-[#1E293B] shadow-sm font-bold'
              : 'text-slate-400 hover:text-[#0F172A] hover:bg-slate-100'
          ]"
          title="Modo Grade"
        >
          <span class="material-symbols-outlined text-lg">grid_view</span>
        </button>
        <button
          @click="store.setViewMode('list')"
          :class="[
            'w-8 h-8 rounded-xl flex items-center justify-center transition-all',
            store.viewMode === 'list'
              ? 'bg-[#E2E8F0] text-[#1E293B] shadow-sm font-bold'
              : 'text-slate-400 hover:text-[#0F172A] hover:bg-slate-100'
          ]"
          title="Modo Lista"
        >
          <span class="material-symbols-outlined text-lg">view_list</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useBookStore } from '@/store/bookStore'

const store = useBookStore()

const isFocused = ref(false)
const isPopoverOpen = ref(false)
const popoverRef = ref(null)

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

const sortOptions = [
  { value: 'modified', label: 'Mais Recentes', icon: 'schedule' },
  { value: 'title', label: 'Título (A-Z)', icon: 'sort_by_alpha' },
  { value: 'author', label: 'Autor (A-Z)', icon: 'person' },
  { value: 'rating', label: 'Melhor Avaliados', icon: 'star' },
  { value: 'progress', label: 'Progresso de Leitura', icon: 'trending_up' },
]

const hasActiveFilter = computed(() => {
  return store.selectedGenre !== 'Todos' || store.sortBy !== 'modified'
})

const activeFilterCount = computed(() => {
  let count = 0
  if (store.selectedGenre !== 'Todos') count++
  if (store.sortBy !== 'modified') count++
  return count
})

function togglePopover() {
  isPopoverOpen.value = !isPopoverOpen.value
}

function resetAllFilters() {
  store.setGenre('Todos')
  store.setSortBy('modified')
}

function handleClickOutside(event) {
  if (popoverRef.value && !popoverRef.value.contains(event.target)) {
    isPopoverOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
