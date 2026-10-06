<template>
  <div
    class="relative group select-none flex flex-col items-center justify-end"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="$emit('select', book)"
  >
    <!-- Book Body with 3D Shelf Perspective -->
    <div
      :class="[
        'relative cursor-pointer transition-all duration-300 ease-out transform-gpu origin-bottom',
        isHovered
          ? '-translate-y-6 scale-[1.07] z-30 shadow-2xl brightness-105'
          : 'hover:-translate-y-2 z-10'
      ]"
      :style="{
        width: '130px',
        height: '190px',
        transform: isHovered
          ? 'perspective(700px) rotateX(0deg) translateY(-20px) scale(1.07)'
          : 'perspective(700px) rotateX(5deg)',
        boxShadow: isHovered
          ? '0 25px 40px -10px rgba(0,0,0,0.6), 0 0 25px rgba(251,191,36,0.3)'
          : '0 12px 20px -6px rgba(0,0,0,0.45)'
      }"
    >
      <!-- Real Cover or Hardcover via BookCover -->
      <div class="w-full h-full rounded-md overflow-hidden relative shadow-inner bg-slate-900 border border-white/10">
        <BookCover
          :cover-url="book.coverUrl"
          :title="book.title"
          :author="book.author"
          :genre="book.genre"
          :isbn="book.isbn"
          size="sm"
          container-class="w-full h-full"
        />

        <!-- Reading Progress Overlay at bottom -->
        <div
          v-if="book.status === 'reading' || book.status === 'read'"
          class="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40 backdrop-blur-sm z-10"
        >
          <div
            class="h-full transition-all duration-300"
            :class="book.status === 'read' ? 'bg-emerald-400' : 'bg-blue-400'"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>

        <!-- Book Spine simulated thickness (left border light) -->
        <div class="absolute left-0 inset-y-0 w-2 bg-gradient-to-r from-black/40 via-white/15 to-transparent pointer-events-none"></div>
      </div>

      <!-- Right 3D Pages Thickness (Páginas do miolo visíveis na lateral) -->
      <div
        class="absolute right-0 top-1 bottom-1 w-2 bg-gradient-to-r from-amber-50 to-amber-100 rounded-r-sm border-r border-amber-200/80 shadow-sm pointer-events-none transform translate-x-1.5 rotate-y-45 opacity-90"
        style="background: repeating-linear-gradient(to right, #F5F5F4, #E7E5E4 1px, #F5F5F4 2px);"
      ></div>

      <!-- Status Mini Badge (Top Right) -->
      <div
        class="absolute -top-2 -right-2 z-20 w-6 h-6 rounded-full flex items-center justify-center shadow-md text-white"
        :class="badgeBg"
        :title="badgeLabel"
      >
        <span class="material-symbols-outlined text-[13px]">{{ badgeIcon }}</span>
      </div>
    </div>

    <!-- Contact Shadow on Shelf Plank -->
    <div
      class="w-32 h-3 bg-black/50 blur-[4px] rounded-full pointer-events-none transition-all duration-300 -mt-1"
      :class="{ 'opacity-90 scale-125 translate-y-1.5': isHovered, 'opacity-40': !isHovered }"
    ></div>

    <!-- Floating Interactive Popover on Hover -->
    <div
      v-if="isHovered || isCardHovered"
      class="absolute bottom-full mb-3 z-50 transition-all pointer-events-auto"
      :class="popoverPositionClass"
    >
      <BookHoverCard
        :book="book"
        @inspect="$emit('select', book)"
        @keep-open="isCardHovered = true"
        @close="handleCardLeave"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BookCover from '@/components/books/BookCover.vue'
import BookHoverCard from './BookHoverCard.vue'

const props = defineProps({
  book: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})

defineEmits(['select'])

const isHovered = ref(false)
const isCardHovered = ref(false)
let leaveTimeout = null

function handleMouseEnter() {
  if (leaveTimeout) clearTimeout(leaveTimeout)
  isHovered.value = true
}

function handleMouseLeave() {
  leaveTimeout = setTimeout(() => {
    if (!isCardHovered.value) {
      isHovered.value = false
    }
  }, 120)
}

function handleCardLeave() {
  isCardHovered.value = false
  isHovered.value = false
}

const progressPercent = computed(() => {
  if (!props.book.totalPages || props.book.totalPages <= 0) return 0
  return Math.min(100, Math.round(((props.book.currentPage || 0) / props.book.totalPages) * 100))
})

const popoverPositionClass = computed(() => {
  if (props.index === 0) return 'left-0'
  return 'left-1/2 -translate-x-1/2'
})

const badgeIcon = computed(() => {
  if (props.book.favorite) return 'star'
  switch (props.book.status) {
    case 'reading': return 'auto_stories'
    case 'read': return 'check_circle'
    case 'to-read': return 'favorite'
    case 'physical': return 'home_storage'
    default: return 'bookmark'
  }
})

const badgeBg = computed(() => {
  if (props.book.favorite) return 'bg-amber-500 ring-2 ring-white/50'
  switch (props.book.status) {
    case 'reading': return 'bg-blue-500'
    case 'read': return 'bg-emerald-500'
    case 'to-read': return 'bg-rose-500'
    case 'physical': return 'bg-slate-700'
    default: return 'bg-slate-800'
  }
})

const badgeLabel = computed(() => {
  if (props.book.favorite) return 'Favorito'
  switch (props.book.status) {
    case 'reading': return 'Lendo Agora'
    case 'read': return 'Lido e Concluído'
    case 'to-read': return 'Quero Ler'
    case 'physical': return 'Acervo Físico'
    default: return 'Livro'
  }
})
</script>
