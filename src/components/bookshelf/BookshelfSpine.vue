<template>
  <div
    class="relative group select-none flex items-end justify-center"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="$emit('select', book)"
  >
    <!-- Book Spine Standing on Shelf -->
    <div
      :class="[
        'relative cursor-pointer transition-all duration-300 ease-out transform-gpu flex flex-col justify-between overflow-hidden shadow-lg',
        isHovered ? '-translate-y-6 scale-[1.05] z-30 shadow-2xl brightness-105' : 'hover:-translate-y-2 z-10'
      ]"
      :style="{
        width: `${spineWidth}px`,
        height: `${spineHeight}px`,
        background: spineTheme.gradient,
        boxShadow: isHovered
          ? '0 24px 38px rgba(0,0,0,0.5), 0 0 20px rgba(251,191,36,0.25)'
          : '2px 4px 10px rgba(0,0,0,0.4), inset -2px 0 6px rgba(0,0,0,0.35), inset 2px 0 6px rgba(255,255,255,0.1)'
      }"
    >
      <!-- Spine 3D Lighting Overlays: Left highlight, right shadow crease -->
      <div class="absolute left-0 inset-y-0 w-1 bg-gradient-to-r from-white/30 to-transparent pointer-events-none"></div>
      <div class="absolute right-0 inset-y-0 w-2 bg-gradient-to-l from-black/40 to-transparent pointer-events-none"></div>

      <!-- Top Book Ribs (Nervuras em relevo no topo) -->
      <div class="pt-2 px-1 flex flex-col gap-0.5 pointer-events-none shrink-0 opacity-80">
        <div class="h-0.5 w-full bg-gradient-to-r from-transparent via-amber-200/60 to-transparent"></div>
        <div class="h-0.5 w-full bg-gradient-to-r from-transparent via-black/40 to-transparent"></div>
      </div>

      <!-- Reading Status Ribbon (if currently reading) -->
      <div
        v-if="book.status === 'reading'"
        class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-4 bg-accent shadow-sm pointer-events-none rounded-b"
        title="Lendo Agora"
      ></div>

      <!-- Center Content: Vertical Rotated Title & Author -->
      <div class="flex-1 my-auto flex items-center justify-center overflow-hidden py-3 px-0.5">
        <div
          class="rotate-90 origin-center whitespace-nowrap flex items-center gap-3 tracking-wider font-bold"
          :class="spineTheme.textClass"
          :style="{
            textShadow: '0 1px 2px rgba(0,0,0,0.6)'
          }"
        >
          <!-- Book Title -->
          <span class="font-serif text-[11px] sm:text-xs tracking-wide max-w-[170px] truncate uppercase font-extrabold">
            {{ book.title }}
          </span>

          <span class="opacity-40 text-[9px]">•</span>

          <!-- Author -->
          <span class="text-[9px] opacity-80 max-w-[100px] truncate font-sans tracking-normal">
            {{ book.author }}
          </span>
        </div>
      </div>

      <!-- Star Badge for Favorite -->
      <div v-if="book.favorite" class="absolute top-4 left-1/2 -translate-x-1/2 text-amber-400 pointer-events-none">
        <span class="material-symbols-outlined text-[10px] fill">star</span>
      </div>

      <!-- Bottom Book Ribs & Edition Tag -->
      <div class="pb-2 px-1 flex flex-col items-center gap-1 shrink-0 pointer-events-none">
        <!-- Bookmark ribbon tail hanging out at bottom -->
        <div
          v-if="book.status === 'reading' || progressPercent > 0"
          class="w-1.5 h-3 bg-rose-500 rounded-b shadow-sm -mb-2"
          :title="`${progressPercent}% lido`"
        ></div>

        <div class="h-0.5 w-full bg-gradient-to-r from-transparent via-amber-200/60 to-transparent opacity-80"></div>
        <span class="text-[8px] font-mono uppercase tracking-widest opacity-60 text-white">
          {{ book.genre ? book.genre.substring(0, 4) : 'FOLH' }}
        </span>
      </div>
    </div>

    <!-- Soft Contact Shadow on Wood Surface below the book -->
    <div
      class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4/5 h-2 bg-black/40 blur-[3px] rounded-full pointer-events-none transition-all duration-300"
      :class="{ 'opacity-80 scale-125 translate-y-1': isHovered, 'opacity-40': !isHovered }"
    ></div>

    <!-- Floating Interactive Popover on Hover -->
    <div
      v-if="isHovered || isCardHovered"
      class="absolute bottom-full mb-4 z-50 transition-all pointer-events-auto"
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

// Calculate spine thickness (width) based on pages
const spineWidth = computed(() => {
  const pages = Number(props.book.totalPages) || 250
  // Scale between 34px (thin) and 60px (tome)
  const calculated = 34 + Math.min(26, Math.floor(pages / 25))
  return calculated
})

// Slight organic natural height variation so shelf looks authentic (215px to 260px)
const spineHeight = computed(() => {
  const hash = (props.book.id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const variations = [225, 235, 245, 255, 230, 240, 250]
  return variations[hash % variations.length]
})

const progressPercent = computed(() => {
  if (!props.book.totalPages || props.book.totalPages <= 0) return 0
  return Math.min(100, Math.round(((props.book.currentPage || 0) / props.book.totalPages) * 100))
})

// Popover alignment depending on position in shelf
const popoverPositionClass = computed(() => {
  if (props.index === 0) return 'left-0'
  return 'left-1/2 -translate-x-1/2'
})

// Rich tactile spine themes with leather/cloth textures and foil lettering
const spineThemes = [
  // Leather Maroon / Wine
  {
    gradient: 'linear-gradient(135deg, #4A0E17 0%, #721C24 50%, #3B0A11 100%)',
    textClass: 'text-amber-100',
  },
  // Deep Oxford Navy
  {
    gradient: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #0B132B 100%)',
    textClass: 'text-amber-200',
  },
  // Forest Emerald
  {
    gradient: 'linear-gradient(135deg, #064E3B 0%, #047857 50%, #022C22 100%)',
    textClass: 'text-emerald-100',
  },
  // Antique Amber / Tobacco
  {
    gradient: 'linear-gradient(135deg, #78350F 0%, #B45309 50%, #451A03 100%)',
    textClass: 'text-amber-100',
  },
  // Charcoal Slate
  {
    gradient: 'linear-gradient(135deg, #18181B 0%, #3F3F46 50%, #09090B 100%)',
    textClass: 'text-zinc-100',
  },
  // Royal Amethyst
  {
    gradient: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 50%, #2E1065 100%)',
    textClass: 'text-purple-100',
  },
  // Vintage Teal
  {
    gradient: 'linear-gradient(135deg, #134E4A 0%, #0F766E 50%, #042F2E 100%)',
    textClass: 'text-cyan-100',
  },
]

const spineTheme = computed(() => {
  const str = (props.book.title || '') + (props.book.genre || '')
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  const idx = Math.abs(hash) % spineThemes.length
  return spineThemes[idx]
})
</script>
