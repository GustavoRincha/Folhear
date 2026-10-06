<template>
  <nav
    class="fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden select-none"
    style="padding-bottom: env(safe-area-inset-bottom, 0px);"
  >
    <div class="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
      <!-- 1. Estante Virtual -->
      <router-link
        to="/estante"
        :class="[
          'flex flex-col items-center justify-center py-1 transition-all active:scale-95',
          route.path === '/estante' ? 'text-accent font-bold' : 'text-slate-500'
        ]"
      >
        <span class="material-symbols-outlined text-2xl">shelves</span>
        <span class="text-[10px] font-medium leading-none mt-1">Estante</span>
      </router-link>

      <!-- 2. Meus Livros -->
      <router-link
        to="/livros"
        :class="[
          'flex flex-col items-center justify-center py-1 transition-all active:scale-95',
          route.path === '/livros' ? 'text-accent font-bold' : 'text-slate-500'
        ]"
      >
        <div class="relative">
          <span class="material-symbols-outlined text-2xl">menu_book</span>
          <span
            v-if="store.counts.reading > 0"
            class="absolute -top-0.5 -right-1 w-2 h-2 bg-accent rounded-full ring-2 ring-white"
          ></span>
        </div>
        <span class="text-[10px] font-medium leading-none mt-1">Livros</span>
      </router-link>

      <!-- 3. Botão Central (+) -->
      <div class="flex items-center justify-center relative">
        <button
          @click="store.openModal('add')"
          class="-translate-y-3 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-slate-900/30 ring-4 ring-white hover:bg-slate-900 active:scale-90 transition-all duration-200"
          aria-label="Adicionar Livro"
        >
          <span class="material-symbols-outlined text-2xl">add</span>
        </button>
      </div>

      <!-- 4. Quero Comprar -->
      <router-link
        to="/comprar"
        :class="[
          'flex flex-col items-center justify-center py-1 transition-all active:scale-95',
          route.path === '/comprar' ? 'text-amber-600 font-bold' : 'text-slate-500'
        ]"
      >
        <div class="relative">
          <span class="material-symbols-outlined text-2xl">shopping_bag</span>
          <span
            v-if="store.counts.wishlist > 0"
            class="absolute -top-1 -right-2 px-1 py-0.2 bg-amber-500 text-white rounded-full text-[9px] font-bold ring-2 ring-white"
          >
            {{ store.counts.wishlist }}
          </span>
        </div>
        <span class="text-[10px] font-medium leading-none mt-1">Comprar</span>
      </router-link>

      <!-- 5. Estatísticas & Painel -->
      <button
        @click="store.openModal('stats')"
        class="flex flex-col items-center justify-center py-1 text-slate-500 hover:text-accent transition-all active:scale-95"
      >
        <span class="material-symbols-outlined text-2xl">analytics</span>
        <span class="text-[10px] font-medium leading-none mt-1 truncate">Painel</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useBookStore } from '@/store/bookStore'

const route = useRoute()
const store = useBookStore()
</script>
