<template>
  <div
    @click="openDetails"
    class="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-outline-variant/60 hover:border-accent/40 flex items-center gap-4 cursor-pointer select-none group"
  >
    <div class="w-16 h-24 sm:w-20 sm:h-28 rounded-lg overflow-hidden shrink-0 shadow-sm relative">
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

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <span
          :class="[
            'px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1',
            statusBadge.bgClass
          ]"
        >
          <span class="material-symbols-outlined text-xs">{{ statusBadge.icon }}</span>
          {{ statusBadge.label }}
        </span>
        <span class="text-xs text-outline font-medium">{{ book.genre }}</span>
      </div>

      <h4 class="text-headline-md font-headline-md font-bold text-on-surface truncate group-hover:text-accent transition-colors text-base sm:text-lg">
        {{ book.title }}
      </h4>
      <p class="text-body-md font-body-md text-on-surface-variant truncate text-sm">
        {{ book.author }}
      </p>

      <div v-if="book.status === 'reading'" class="mt-2 flex items-center gap-3 max-w-xs">
        <div class="flex-1 bg-surface-container-high h-2 rounded-full overflow-hidden">
          <div class="bg-accent h-full rounded-full transition-all" :style="{ width: `${progressPercent}%` }"></div>
        </div>
        <span class="text-xs font-bold text-accent whitespace-nowrap">{{ book.currentPage || 0 }}/{{ book.totalPages }} pág ({{ progressPercent }}%)</span>
      </div>

      <div v-else-if="book.status === 'read'" class="mt-2 flex items-center gap-2 text-xs text-emerald-700 font-bold">
        <div class="flex items-center text-amber-500">
          <span v-for="i in 5" :key="i" class="material-symbols-outlined text-sm" :class="{ 'fill': i <= (book.rating || 5) }">star</span>
        </div>
        <span>{{ book.totalPages }} páginas lidas</span>
      </div>
    </div>

    <div class="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-low text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-all">
      <span class="material-symbols-outlined">chevron_right</span>
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
  return Math.min(100, Math.round(((props.book.currentPage || 0) / props.book.totalPages) * 100))
})

const statusBadge = computed(() => {
  switch (props.book.status) {
    case 'reading':
      return { label: 'Lendo Agora', icon: 'auto_stories', bgClass: 'bg-blue-50 text-accent border border-blue-200' }
    case 'read':
      return { label: 'Concluído', icon: 'check_circle', bgClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200' }
    case 'to-read':
      return { label: 'Quero Ler', icon: 'favorite', bgClass: 'bg-[#E2E8F0] text-[#1E293B] border border-slate-300' }
    case 'physical':
      return { label: 'Acervo Físico', icon: 'home_storage', bgClass: 'bg-surface-container text-on-surface border border-outline-variant' }
    case 'wishlist':
      return { label: 'Quero Comprar', icon: 'shopping_bag', bgClass: 'bg-amber-50 text-amber-800 border border-amber-200' }
    default:
      return { label: 'Livro', icon: 'book', bgClass: 'bg-surface-container text-on-surface' }
  }
})

function openDetails() {
  store.openModal('details', props.book)
}
</script>
