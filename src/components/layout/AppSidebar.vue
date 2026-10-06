<template>
  <nav class="h-full w-[260px] fixed left-0 top-0 hidden md:flex flex-col bg-surface-container-lowest border-r border-outline-variant py-6 px-4 gap-4 z-40 select-none overflow-y-auto">
    <!-- Brand Header -->
    <router-link to="/estante" class="flex items-center gap-2 mb-2 px-2 cursor-pointer">
      <span class="material-symbols-outlined text-accent text-3xl">auto_stories</span>
      <span class="text-headline-lg font-headline-lg font-black text-on-surface tracking-tight">Folhear</span>
    </router-link>

    <!-- Navigation: Minha Biblioteca (Livros que tem) -->
    <div>
      <h2 class="text-label-sm font-label-sm text-slate-400 uppercase tracking-wider mb-2 px-2">
        Minha Biblioteca
      </h2>
      <ul class="flex flex-col gap-1">
        <!-- Estante Virtual 3D -->
        <li>
          <router-link
            to="/estante"
            :class="[
              'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left font-semibold transition-all duration-200',
              route.path === '/estante'
                ? 'bg-primary text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]'
            ]"
          >
            <span
              class="material-symbols-outlined text-xl"
              :class="route.path === '/estante' ? 'text-amber-400' : 'text-slate-400'"
            >
              shelves
            </span>
            <span class="text-sm flex-1">Estante Virtual</span>
            <span
              :class="[
                'rounded-full px-2 py-0.5 text-xs font-bold',
                route.path === '/estante' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              ]"
            >
              {{ store.counts.owned }}
            </span>
          </router-link>
        </li>

        <!-- Meus Livros (Catálogo) -->
        <li>
          <router-link
            to="/livros"
            :class="[
              'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left font-semibold transition-all duration-200',
              route.path === '/livros'
                ? 'bg-primary text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]'
            ]"
          >
            <span
              class="material-symbols-outlined text-xl"
              :class="route.path === '/livros' ? 'text-accent' : 'text-slate-400'"
            >
              menu_book
            </span>
            <span class="text-sm flex-1">Meus Livros</span>
            <span
              :class="[
                'rounded-full px-2 py-0.5 text-xs font-bold',
                route.path === '/livros' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              ]"
            >
              {{ store.counts.owned }}
            </span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Navigation: Compras & Desejos (Livros que quer comprar) -->
    <div>
      <h2 class="text-label-sm font-label-sm text-slate-400 uppercase tracking-wider mb-2 px-2">
        Compras & Desejos
      </h2>
      <ul class="flex flex-col gap-1">
        <!-- Quero Comprar (Wishlist) -->
        <li>
          <router-link
            to="/comprar"
            :class="[
              'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left font-semibold transition-all duration-200',
              route.path === '/comprar'
                ? 'bg-primary text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]'
            ]"
          >
            <span
              class="material-symbols-outlined text-xl"
              :class="route.path === '/comprar' ? 'text-amber-400' : 'text-amber-600'"
            >
              shopping_bag
            </span>
            <span class="text-sm flex-1">Quero Comprar</span>
            <span
              :class="[
                'rounded-full px-2 py-0.5 text-xs font-bold',
                route.path === '/comprar' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
              ]"
            >
              {{ store.counts.wishlist }}
            </span>
          </router-link>
        </li>

        <!-- Radar de Preços -->
        <li>
          <button
            @click="store.openModal('radar')"
            class="w-full flex items-center gap-3 px-3.5 py-2.5 text-slate-600 hover:bg-amber-50 hover:text-amber-900 rounded-2xl text-left font-semibold transition-all duration-200 group"
          >
            <span class="material-symbols-outlined text-xl text-amber-600 group-hover:scale-110 transition-transform">
              price_check
            </span>
            <span class="text-sm flex-1">Radar de Preços</span>
            <span class="rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900">
              Ao Vivo
            </span>
          </button>
        </li>
      </ul>
    </div>

    <!-- Navigation: Painel & Ferramentas -->
    <div class="mb-auto">
      <h2 class="text-label-sm font-label-sm text-slate-400 uppercase tracking-wider mb-2 px-2">
        Painel
      </h2>
      <ul class="flex flex-col gap-1">
        <li>
          <button
            @click="store.openModal('stats')"
            class="w-full flex items-center gap-3 px-3.5 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-[#0F172A] rounded-2xl text-left font-medium transition-all"
          >
            <span class="material-symbols-outlined text-xl text-slate-400">bar_chart</span>
            <span class="text-sm">Estatísticas</span>
          </button>
        </li>
        <li>
          <button
            @click="store.openModal('backup')"
            class="w-full flex items-center gap-3 px-3.5 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-[#0F172A] rounded-2xl text-left font-medium transition-all"
          >
            <span class="material-symbols-outlined text-xl text-slate-400">cloud_sync</span>
            <span class="text-sm">Backup & Dados</span>
          </button>
        </li>
      </ul>
    </div>

    <!-- Action Buttons (Bottom) -->
    <div class="mt-auto flex flex-col gap-2 pt-2 border-t border-slate-100">
      <button
        @click="store.openModal('scanner')"
        class="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-semibold py-2.5 px-4 rounded-xl border border-slate-200 transition-all active:scale-[0.98] text-xs"
      >
        <span class="material-symbols-outlined text-accent text-lg">barcode_scanner</span>
        <span>Escanear ISBN</span>
      </button>

      <button
        @click="store.openModal('add')"
        class="w-full flex items-center justify-center gap-2 bg-primary text-white hover:bg-slate-900 font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] text-xs"
      >
        <span class="material-symbols-outlined text-lg">add</span>
        <span>Novo Livro</span>
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
