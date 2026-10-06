<template>
  <div
    @click="openDetails"
    class="group relative flex flex-col gap-xs bg-surface-container-lowest rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-outline-variant/60 hover:border-accent/40 cursor-pointer select-none"
  >
    <!-- Status Icon Badge Top-Right -->
    <div
      :class="[
        'absolute top-5 right-5 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-110',
        badgeConfig.bgClass
      ]"
      :title="badgeConfig.label"
    >
      <span class="material-symbols-outlined text-[18px]" :class="{ 'fill': book.status === 'to-read' }">
        {{ badgeConfig.icon }}
      </span>
    </div>

    <!-- Book Cover Container (Aspect Ratio 2:3) -->
    <div class="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] bg-surface-container-high">
      <BookCover
        :cover-url="book.coverUrl"
        :title="book.title"
        :author="book.author"
        :genre="book.genre"
        :isbn="book.isbn"
        size="md"
        container-class="w-full h-full"
      />

      <!-- Progress Bar Overlay (Bottom of Cover) -->
      <div v-if="showProgressOverlay" class="absolute bottom-0 left-0 w-full h-1.5 bg-black/25 backdrop-blur-sm z-10">
        <div
          v-if="book.status === 'reading'"
          class="h-full bg-accent transition-all duration-300"
          :style="{ width: `${progressPercent}%` }"
        ></div>
        <div
          v-else-if="book.status === 'read'"
          class="h-full bg-emerald-500 w-full"
        ></div>
      </div>
    </div>

    <!-- Metadata Information -->
    <div class="mt-2 flex flex-col">
      <h4 class="text-body-md font-body-md font-bold text-on-surface truncate group-hover:text-accent transition-colors" :title="book.title">
        {{ book.title }}
      </h4>
      <p class="text-label-sm font-label-sm text-on-surface-variant truncate" :title="book.author">
        {{ book.author }}
      </p>

      <!-- Dynamic Status/Progress Label -->
      <div class="mt-1 flex items-center justify-between">
        <span v-if="book.status === 'reading'" class="text-[11px] text-accent font-bold">
          {{ progressPercent }}% Concluído
        </span>

        <span v-else-if="book.status === 'read'" class="text-[11px] text-emerald-700 font-bold flex items-center gap-0.5">
          <span class="material-symbols-outlined text-xs fill text-amber-500">star</span>
          <span>{{ book.rating || 5 }}/5</span>
          <span class="text-outline font-normal ml-1">Lido</span>
        </span>

        <span v-else-if="book.status === 'wishlist'" class="text-[11px] text-on-surface font-black">
          {{ formatPrice(book.price) }}
        </span>

        <span v-else-if="book.status === 'physical'" class="text-[10px] text-on-surface-variant font-medium">
          {{ book.totalPages ? `${book.totalPages} págs • Físico` : 'Acervo Físico' }}
        </span>

        <span v-else class="text-[10px] text-on-surface-variant font-medium">
          {{ book.totalPages ? `${book.totalPages} págs` : 'Fila de Leitura' }}
        </span>

        <span v-if="book.favorite" class="material-symbols-outlined text-xs text-amber-500 fill" title="Favorito">
          favorite
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBookStore } from '@/store/bookStore'
import BookCover from './BookCover.vue'

const props = defineProps({
  book: {
    type: Object,
    required: true,
  }
})

const store = useBookStore()

const progressPercent = computed(() => {
  if (!props.book.totalPages || props.book.totalPages <= 0) return 0
  const percent = Math.round(((props.book.currentPage || 0) / props.book.totalPages) * 100)
  return Math.min(100, Math.max(0, percent))
})

const showProgressOverlay = computed(() => {
  return props.book.status === 'reading' || props.book.status === 'read'
})

const badgeConfig = computed(() => {
  switch (props.book.status) {
    case 'reading':
      return {
        icon: 'auto_stories',
        bgClass: 'bg-accent text-white',
        label: 'Lendo Agora'
      }
    case 'to-read':
      return {
        icon: 'favorite',
        bgClass: 'bg-[#E2E8F0] text-[#1E293B]',
        label: 'Quero Ler'
      }
    case 'read':
      return {
        icon: 'check_circle',
        bgClass: 'bg-emerald-100 text-emerald-800',
        label: 'Concluído'
      }
    case 'physical':
      return {
        icon: 'home_storage',
        bgClass: 'bg-surface-container text-on-surface border border-outline-variant',
        label: 'Livro Físico'
      }
    case 'wishlist':
      return {
        icon: 'shopping_bag',
        bgClass: 'bg-amber-100 text-amber-900',
        label: 'Quero Comprar'
      }
    default:
      return {
        icon: 'book',
        bgClass: 'bg-surface-container text-on-surface',
        label: 'Livro'
      }
  }
})

function formatPrice(val) {
  if (!val || val <= 0) return 'Quero Comprar'
  return `R$ ${Number(val).toFixed(2).replace('.', ',')}`
}

function openDetails() {
  store.openModal('details', props.book)
}
</script>
