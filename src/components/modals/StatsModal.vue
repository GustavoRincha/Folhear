<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
    <div class="bg-surface-container-lowest rounded-2xl w-full max-w-xl shadow-2xl border border-outline-variant/50 flex flex-col overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b border-surface-variant flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">analytics</span>
          </div>
          <div>
            <h3 class="text-headline-md font-headline-md font-bold text-on-surface">Painel de Estatísticas</h3>
            <p class="text-label-sm font-label-sm text-on-surface-variant">Resumo do seu hábito e biblioteca</p>
          </div>
        </div>
        <button
          @click="store.closeModal"
          class="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto max-h-[75vh] flex flex-col gap-5">
        <!-- Annual Reading Goal -->
        <div class="bg-blue-50/60 border border-blue-200/80 p-5 rounded-2xl flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-accent text-xl">emoji_events</span>
              <h4 class="font-bold text-sm text-on-surface">Meta de Leitura Anual</h4>
            </div>
            <span class="text-xs font-extrabold text-accent">{{ stats.readCount }} de {{ stats.yearlyGoal }} livros ({{ stats.goalProgress }}%)</span>
          </div>

          <div class="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
            <div class="bg-accent h-full rounded-full transition-all duration-500" :style="{ width: `${stats.goalProgress}%` }"></div>
          </div>
          <p class="text-xs text-on-surface-variant">
            Faltam apenas {{ Math.max(0, stats.yearlyGoal - stats.readCount) }} livros para atingir sua meta anual!
          </p>
        </div>

        <!-- 4 Grid Stat Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <!-- Total Books -->
          <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 flex flex-col">
            <span class="text-xs font-semibold text-outline">Total no Acervo</span>
            <span class="text-2xl font-black text-on-surface mt-1">{{ stats.totalBooks }}</span>
            <span class="text-[11px] text-on-surface-variant mt-auto pt-2">Volumes cadastrados</span>
          </div>

          <!-- Total Read -->
          <div class="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 flex flex-col">
            <span class="text-xs font-semibold text-emerald-800">Lidos &amp; Concluídos</span>
            <span class="text-2xl font-black text-emerald-700 mt-1">{{ stats.readCount }}</span>
            <span class="text-[11px] text-emerald-800/80 mt-auto pt-2">Livros finalizados</span>
          </div>

          <!-- Total Pages -->
          <div class="bg-blue-50/70 p-4 rounded-xl border border-blue-200 flex flex-col">
            <span class="text-xs font-semibold text-accent">Páginas Lidas</span>
            <span class="text-2xl font-black text-accent mt-1">{{ stats.totalPagesRead }}</span>
            <span class="text-[11px] text-on-surface-variant mt-auto pt-2">Páginas acumuladas</span>
          </div>

          <!-- Currently Reading -->
          <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 flex flex-col">
            <span class="text-xs font-semibold text-outline">Lendo no Momento</span>
            <span class="text-2xl font-black text-accent mt-1">{{ stats.readingCount }}</span>
            <span class="text-[11px] text-on-surface-variant mt-auto pt-2">Em andamento</span>
          </div>

          <!-- Physical Books -->
          <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 flex flex-col">
            <span class="text-xs font-semibold text-outline">Livros Físicos</span>
            <span class="text-2xl font-black text-on-surface mt-1">{{ stats.physicalCount }}</span>
            <span class="text-[11px] text-on-surface-variant mt-auto pt-2">Na sua estante real</span>
          </div>

          <!-- Wishlist Value -->
          <div class="bg-amber-50/70 p-4 rounded-xl border border-amber-200 flex flex-col">
            <span class="text-xs font-semibold text-amber-900">Lista de Desejos</span>
            <span class="text-xl font-black text-amber-900 mt-1">R$ {{ stats.totalWishlistValue.toFixed(2) }}</span>
            <span class="text-[11px] text-amber-800/80 mt-auto pt-2">{{ stats.wishlistCount }} livros para comprar</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-surface-variant flex justify-end bg-surface-container-low/40">
        <button
          @click="store.closeModal"
          class="px-5 py-2 bg-primary text-on-primary rounded-lg font-bold text-xs hover:bg-slate-900 transition-colors shadow-sm"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBookStore } from '@/store/bookStore'

const store = useBookStore()
const stats = computed(() => store.stats)
</script>
