<template>
  <div class="relative bg-primary overflow-hidden rounded-2xl p-6 md:p-8 shadow-xl border border-primary-fixed-dim/30 text-on-primary">
    <!-- Decorative Background Pattern -->
    <div class="absolute right-0 top-0 w-3/4 h-full pointer-events-none opacity-15 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-primary-container to-transparent"></div>
    <div class="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>

    <!-- Content Header Area -->
    <div class="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-md">
      <div class="max-w-xl">
        <div class="flex items-center gap-xs mb-sm">
          <span class="material-symbols-outlined text-3xl md:text-4xl text-on-primary">{{ currentIcon }}</span>
          <h2 class="text-headline-xl-mobile md:text-headline-xl font-headline-xl text-on-primary font-extrabold tracking-tight">
            {{ currentTitle }}
          </h2>
        </div>
        <p class="text-body-md md:text-body-lg font-body-lg text-primary-fixed opacity-95 leading-relaxed">
          {{ currentDescription }}
        </p>
      </div>

      <!-- Action Pill Buttons inside Hero -->
      <div class="flex flex-wrap gap-xs">
        <button
          @click="store.openModal('backup')"
          class="flex items-center gap-xs bg-white/20 hover:bg-white/30 active:scale-95 backdrop-blur-sm text-on-primary px-4 py-2 rounded-full text-label-sm font-label-sm transition-all border border-white/10 shadow-sm"
        >
          <span class="material-symbols-outlined text-base">cloud_sync</span>
          <span>Backup</span>
        </button>
      </div>
    </div>

    <!-- Quick Filter Pills Inside Banner -->
    <div class="relative z-10 mt-6 md:mt-8 flex overflow-x-auto hide-scrollbar gap-sm pb-1 pt-1">
      <!-- Todos -->
      <button
        @click="store.setFilter('all')"
        :class="[
          'shrink-0 flex items-center gap-xs px-4 py-2 rounded-full text-label-sm font-label-sm transition-all duration-200 active:scale-95',
          store.activeFilter === 'all'
            ? 'bg-[#E2E8F0] text-[#1E293B] font-bold shadow-md'
            : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-on-primary border border-white/10'
        ]"
      >
        <span class="material-symbols-outlined text-sm" :class="{ 'fill': store.activeFilter === 'all' }">library_books</span>
        <span>Todos ({{ store.counts.all }})</span>
      </button>

      <!-- Lendo Agora -->
      <button
        @click="store.setFilter('reading')"
        :class="[
          'shrink-0 flex items-center gap-xs px-4 py-2 rounded-full text-label-sm font-label-sm transition-all duration-200 active:scale-95',
          store.activeFilter === 'reading'
            ? 'bg-[#E2E8F0] text-[#1E293B] font-bold shadow-md'
            : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-on-primary border border-white/10'
        ]"
      >
        <span class="material-symbols-outlined text-sm" :class="{ 'fill': store.activeFilter === 'reading' }">auto_stories</span>
        <span>Lendo Agora ({{ store.counts.reading }})</span>
      </button>

      <!-- Lidos -->
      <button
        @click="store.setFilter('read')"
        :class="[
          'shrink-0 flex items-center gap-xs px-4 py-2 rounded-full text-label-sm font-label-sm transition-all duration-200 active:scale-95',
          store.activeFilter === 'read'
            ? 'bg-[#E2E8F0] text-[#1E293B] font-bold shadow-md'
            : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-on-primary border border-white/10'
        ]"
      >
        <span class="material-symbols-outlined text-sm" :class="{ 'fill': store.activeFilter === 'read' }">check_circle</span>
        <span>Lidos ({{ store.counts.read }})</span>
      </button>

      <!-- Quero Ler -->
      <button
        @click="store.setFilter('to-read')"
        :class="[
          'shrink-0 flex items-center gap-xs px-4 py-2 rounded-full text-label-sm font-label-sm transition-all duration-200 active:scale-95',
          store.activeFilter === 'to-read'
            ? 'bg-[#E2E8F0] text-[#1E293B] font-bold shadow-md'
            : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-on-primary border border-white/10'
        ]"
      >
        <span class="material-symbols-outlined text-sm" :class="{ 'fill': store.activeFilter === 'to-read' }">favorite</span>
        <span>Quero Ler ({{ store.counts.toRead }})</span>
      </button>

      <!-- Acervo Físico -->
      <button
        @click="store.setFilter('physical')"
        :class="[
          'shrink-0 flex items-center gap-xs px-4 py-2 rounded-full text-label-sm font-label-sm transition-all duration-200 active:scale-95',
          store.activeFilter === 'physical'
            ? 'bg-[#E2E8F0] text-[#1E293B] font-bold shadow-md'
            : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-on-primary border border-white/10'
        ]"
      >
        <span class="material-symbols-outlined text-sm" :class="{ 'fill': store.activeFilter === 'physical' }">home_storage</span>
        <span>Acervo Físico ({{ store.counts.physical }})</span>
      </button>

      <!-- Quero Comprar -->
      <button
        @click="store.setFilter('wishlist')"
        :class="[
          'shrink-0 flex items-center gap-xs px-4 py-2 rounded-full text-label-sm font-label-sm transition-all duration-200 active:scale-95',
          store.activeFilter === 'wishlist'
            ? 'bg-[#E2E8F0] text-[#1E293B] font-bold shadow-md'
            : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-on-primary border border-white/10'
        ]"
      >
        <span class="material-symbols-outlined text-sm" :class="{ 'fill': store.activeFilter === 'wishlist' }">shopping_bag</span>
        <span>Quero Comprar ({{ store.counts.wishlist }})</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBookStore } from '@/store/bookStore'

const store = useBookStore()

const currentTitle = computed(() => {
  switch (store.activeFilter) {
    case 'reading': return 'Lendo no Momento'
    case 'read': return 'Lidos e Concluídos'
    case 'to-read': return 'Quero Ler'
    case 'physical': return 'Acervo Físico'
    case 'wishlist': return 'Lista de Desejos (Quero Comprar)'
    default: return 'Todos os Livros'
  }
})

const currentIcon = computed(() => {
  switch (store.activeFilter) {
    case 'reading': return 'auto_stories'
    case 'read': return 'check_circle'
    case 'to-read': return 'favorite'
    case 'physical': return 'home_storage'
    case 'wishlist': return 'shopping_bag'
    default: return 'library_books'
  }
})

const currentDescription = computed(() => {
  switch (store.activeFilter) {
    case 'reading': return 'Acompanhe o ritmo das suas leituras ativas e registre cada página lida.'
    case 'read': return 'Seu histórico literário, notas, avaliações e resenhas favoritas.'
    case 'to-read': return 'Sua lista selecionada de próximas leituras para explorar em breve.'
    case 'physical': return 'Catálogo de livros físicos que você possui em suas estantes.'
    case 'wishlist': return 'Livros que você deseja adquirir e estimativa de investimento.'
    default: return 'Organize, descubra e acompanhe seu progresso de leitura em um ambiente tranquilo e focado.'
  }
})
</script>
