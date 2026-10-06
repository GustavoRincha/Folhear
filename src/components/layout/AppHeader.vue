<template>
  <header
    class="flex justify-between items-center w-full px-container-margin h-16 md:h-20 sticky top-0 bg-primary text-white z-30 shadow-md border-b border-slate-700/60 transition-all"
    style="padding-top: env(safe-area-inset-top, 0px); height: calc(4rem + env(safe-area-inset-top, 0px));"
  >
    <!-- Mobile Brand -->
    <div class="flex items-center gap-sm md:hidden">
      <button 
        @click="store.openModal('menu')" 
        class="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-slate-700/70 transition-colors"
        aria-label="Abrir Menu de Navegação"
      >
        <span class="material-symbols-outlined text-white">menu</span>
      </button>
      <router-link to="/estante" class="flex items-center gap-1.5 cursor-pointer">
        <span class="material-symbols-outlined text-accent text-2xl">auto_stories</span>
        <span class="text-headline-md font-headline-md font-black text-white tracking-tight">Folhear</span>
      </router-link>
    </div>

    <!-- Desktop Title & Subtitle + View Switcher -->
    <div class="hidden md:flex items-center gap-6">
      <div class="flex flex-col">
        <h1 class="text-headline-lg font-headline-lg font-bold text-white">{{ headerTitle }}</h1>
        <p class="text-body-md font-body-md text-white/80">{{ headerSubtitle }}</p>
      </div>

      <!-- Quick Route Switcher Pills in Header -->
      <div class="flex items-center bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60 ml-2">
        <router-link
          to="/estante"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5',
            route.path === '/estante' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'text-slate-300 hover:text-white'
          ]"
        >
          <span class="material-symbols-outlined text-base">shelves</span>
          <span>Estante Virtual</span>
        </router-link>

        <router-link
          to="/livros"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5',
            route.path === '/livros' ? 'bg-blue-400/20 text-blue-300 border border-blue-400/30' : 'text-slate-300 hover:text-white'
          ]"
        >
          <span class="material-symbols-outlined text-base">menu_book</span>
          <span>Meus Livros</span>
        </router-link>

        <router-link
          to="/comprar"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5',
            route.path === '/comprar' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' : 'text-slate-300 hover:text-white'
          ]"
        >
          <span class="material-symbols-outlined text-base">shopping_bag</span>
          <span>Quero Comprar</span>
          <span
            v-if="store.counts.wishlist > 0"
            class="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-stone-950 font-black"
          >
            {{ store.counts.wishlist }}
          </span>
        </router-link>
      </div>
    </div>

    <!-- Right Header Actions -->
    <div class="flex items-center gap-sm">
      <!-- Mobile Radar Button -->
      <button
        @click="store.openModal('radar')"
        class="md:hidden w-10 h-10 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 flex items-center justify-center transition-colors"
        title="Radar de Preços & Ofertas"
      >
        <span class="material-symbols-outlined text-xl">price_check</span>
      </button>

      <!-- Desktop Quick Actions -->
      <div class="hidden md:flex gap-sm mr-2">
        <button
          @click="store.openModal('radar')"
          class="flex items-center gap-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 px-3.5 py-2 rounded-full font-label-sm text-label-sm shadow-sm transition-all duration-200 active:scale-95"
          title="Buscar e Comparar Preços nas Lojas"
        >
          <span class="material-symbols-outlined text-base text-amber-400">price_check</span>
          <span class="text-white font-semibold">Radar de Preços</span>
        </button>

        <button
          @click="store.openModal('scanner')"
          class="flex items-center gap-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-full font-label-sm text-label-sm shadow-sm transition-all duration-200 active:scale-95"
        >
          <span class="material-symbols-outlined text-base text-accent">barcode_scanner</span>
          <span class="text-white">Escanear</span>
        </button>

        <button
          @click="store.openModal('add')"
          class="flex items-center gap-xs bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-full font-label-sm text-label-sm shadow-md transition-all duration-200 active:scale-95"
        >
          <span class="material-symbols-outlined text-base text-white">add</span>
          <span class="text-white">Novo Livro</span>
        </button>
      </div>

      <!-- Notification / Info Bell -->
      <button
        @click="store.openModal('stats')"
        class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors relative"
        title="Progresso e Estatísticas"
      >
        <span class="material-symbols-outlined text-xl text-white">notifications</span>
        <span
          v-if="store.counts.reading > 0"
          class="absolute top-2 right-2 w-2.5 h-2.5 bg-accent rounded-full ring-2 ring-primary"
        ></span>
      </button>

      <!-- User Avatar Profile -->
      <div
        @click="store.openModal('profile')"
        class="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center overflow-hidden border-2 border-white/30 shadow-sm cursor-pointer hover:ring-2 hover:ring-accent/50 transition-all shrink-0"
        title="Meu Perfil de Leitor"
      >
        <img
          v-if="store.userProfile.avatarUrl"
          :src="store.userProfile.avatarUrl"
          class="w-full h-full object-cover"
        />
        <span v-else class="font-bold text-xs tracking-wider text-white">
          {{ store.profileInitials }}
        </span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBookStore } from '@/store/bookStore'

const route = useRoute()
const store = useBookStore()

const headerTitle = computed(() => {
  switch (route.path) {
    case '/estante': return 'Minha Estante Virtual'
    case '/livros': return 'Meus Livros'
    case '/comprar': return 'Quero Comprar'
    default: return 'Folhear Biblioteca'
  }
})

const headerSubtitle = computed(() => {
  switch (route.path) {
    case '/estante': return 'Seus livros em prateleiras 3D com interação em tempo real.'
    case '/livros': return 'Catálogo completo de obras com acompanhamento de progresso.'
    case '/comprar': return 'Lista de desejos com radar de preços e acompanhamento de compras.'
    default: return 'Acompanhe suas leituras e acervo pessoal.'
  }
})
</script>
