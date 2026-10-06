<template>
  <div
    class="pointer-events-auto bg-slate-900/95 text-white rounded-2xl p-4 shadow-2xl border border-slate-700/80 backdrop-blur-md w-72 flex flex-col gap-3 text-left animate-popover-in z-50 select-none"
    @mouseenter="$emit('keep-open')"
    @mouseleave="$emit('close')"
  >
    <!-- Top Row: Cover Thumbnail + Title & Author -->
    <div class="flex gap-3 items-start">
      <!-- Thumbnail Cover -->
      <div class="w-14 h-20 rounded-lg overflow-hidden shrink-0 shadow-md border border-slate-700 bg-slate-800">
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

      <!-- Main Meta -->
      <div class="flex-1 min-w-0 flex flex-col">
        <!-- Status & Genre Pills -->
        <div class="flex items-center gap-1.5 mb-1 flex-wrap">
          <span
            :class="[
              'px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider',
              statusConfig.badgeClass
            ]"
          >
            <span class="material-symbols-outlined text-xs">{{ statusConfig.icon }}</span>
            <span>{{ statusConfig.label }}</span>
          </span>
          <span v-if="book.genre" class="text-[10px] text-slate-400 font-medium truncate">
            {{ book.genre }}
          </span>
        </div>

        <!-- Title -->
        <h4 class="font-bold text-sm text-white leading-snug line-clamp-2" :title="book.title">
          {{ book.title }}
        </h4>

        <!-- Author -->
        <p class="text-xs text-slate-400 truncate mt-0.5" :title="book.author">
          {{ book.author }}
        </p>

        <!-- Stars Rating -->
        <div class="flex items-center gap-0.5 mt-1.5">
          <span
            v-for="s in 5"
            :key="s"
            class="material-symbols-outlined text-sm"
            :class="s <= (book.rating || 0) ? 'text-amber-400 fill' : 'text-slate-600'"
          >
            star
          </span>
          <span v-if="book.rating > 0" class="text-[11px] font-bold text-amber-400 ml-1">
            {{ book.rating }}/5
          </span>
        </div>
      </div>
    </div>

    <!-- Reading Progress Section (if reading or read) -->
    <div
      v-if="book.status === 'reading' || book.status === 'read'"
      class="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60 flex flex-col gap-1.5"
    >
      <div class="flex items-center justify-between text-xs">
        <span class="text-slate-400 font-medium">Progresso</span>
        <span class="font-bold" :class="book.status === 'read' ? 'text-emerald-400' : 'text-blue-400'">
          {{ progressPercent }}% ({{ book.currentPage || 0 }}/{{ book.totalPages || '?' }} pág)
        </span>
      </div>

      <!-- Bar -->
      <div class="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-300"
          :class="book.status === 'read' ? 'bg-emerald-400' : 'bg-blue-400'"
          :style="{ width: `${progressPercent}%` }"
        ></div>
      </div>

      <!-- Quick Page Increments for Active Reading -->
      <div v-if="book.status === 'reading'" class="flex items-center justify-between pt-1">
        <span class="text-[10px] text-slate-400">Avançar leitura:</span>
        <div class="flex items-center gap-1">
          <button
            type="button"
            @click.stop="incrementPages(5)"
            class="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-blue-300 text-[10px] font-bold transition-colors"
          >
            +5 pág
          </button>
          <button
            type="button"
            @click.stop="incrementPages(10)"
            class="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-blue-300 text-[10px] font-bold transition-colors"
          >
            +10 pág
          </button>
          <button
            type="button"
            @click.stop="markAsRead"
            class="px-2 py-0.5 rounded bg-emerald-600/80 hover:bg-emerald-600 text-white text-[10px] font-bold transition-colors"
            title="Concluir livro"
          >
            Lido!
          </button>
        </div>
      </div>
    </div>

    <!-- Notes excerpt if available -->
    <div
      v-if="book.notes"
      class="text-[11px] text-slate-300 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50 italic line-clamp-2"
    >
      "{{ book.notes }}"
    </div>

    <!-- Bottom Action Buttons -->
    <div class="flex items-center justify-between gap-2 pt-1 border-t border-slate-800">
      <!-- Favorite Star Toggle -->
      <button
        type="button"
        @click.stop="toggleFavorite"
        class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
        :title="book.favorite ? 'Remover dos favoritos' : 'Favoritar'"
      >
        <span
          class="material-symbols-outlined text-base"
          :class="book.favorite ? 'text-amber-400 fill' : 'text-slate-400'"
        >
          favorite
        </span>
      </button>

      <!-- View Details Button -->
      <button
        type="button"
        @click.stop="$emit('inspect')"
        class="flex-1 py-1.5 px-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
      >
        <span class="material-symbols-outlined text-sm">visibility</span>
        <span>Ver Detalhes</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBookStore } from '@/store/bookStore'
import BookCover from '@/components/books/BookCover.vue'

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})

defineEmits(['inspect', 'close', 'keep-open'])

const store = useBookStore()

const progressPercent = computed(() => {
  if (!props.book.totalPages || props.book.totalPages <= 0) return 0
  const pct = Math.round(((props.book.currentPage || 0) / props.book.totalPages) * 100)
  return Math.min(100, Math.max(0, pct))
})

const statusConfig = computed(() => {
  switch (props.book.status) {
    case 'reading':
      return { label: 'Lendo Agora', icon: 'auto_stories', badgeClass: 'bg-blue-500/20 text-blue-300 border border-blue-400/30' }
    case 'read':
      return { label: 'Concluído', icon: 'check_circle', badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' }
    case 'to-read':
      return { label: 'Quero Ler', icon: 'favorite', badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-400/30' }
    case 'physical':
      return { label: 'Acervo Físico', icon: 'home_storage', badgeClass: 'bg-slate-700 text-slate-200 border border-slate-600' }
    case 'wishlist':
      return { label: 'Quero Comprar', icon: 'shopping_bag', badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-400/30' }
    default:
      return { label: 'Na Estante', icon: 'book', badgeClass: 'bg-slate-700 text-slate-200' }
  }
})

function toggleFavorite() {
  store.updateBook(props.book.id, { favorite: !props.book.favorite })
}

function incrementPages(amount) {
  const current = props.book.currentPage || 0
  const total = props.book.totalPages || 9999
  const next = Math.min(total, current + amount)
  store.updateProgress(props.book.id, next)
}

function markAsRead() {
  store.updateBook(props.book.id, {
    status: 'read',
    currentPage: props.book.totalPages || props.book.currentPage || 1,
    finishDate: new Date().toISOString().split('T')[0]
  })
}
</script>

<style scoped>
@keyframes popoverIn {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-popover-in {
  animation: popoverIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
