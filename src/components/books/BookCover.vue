<template>
  <div
    :class="[
      'relative overflow-hidden flex flex-col select-none rounded-lg shadow-sm group',
      containerClass
    ]"
  >
    <!-- Real Image Cover (if available and not errored) -->
    <img
      v-if="currentSrc && !hasAllFailed"
      :src="currentSrc"
      :alt="title"
      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      loading="lazy"
      @error="handleImageError"
      @load="handleImageLoad"
    />

    <!-- Stylish Dynamic Typographic Hardcover (when no image or all fallbacks failed) -->
    <div
      v-else
      :class="[
        'w-full h-full p-3 flex flex-col justify-between relative bg-gradient-to-br transition-all duration-300 group-hover:scale-[1.02]',
        theme.bg,
        theme.text
      ]"
    >
      <!-- Simulated Book Spine Left Highlight -->
      <div class="absolute left-0 inset-y-0 w-2.5 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none"></div>
      <!-- Book Crease Shadow -->
      <div class="absolute left-2.5 inset-y-0 w-0.5 bg-black/30 pointer-events-none"></div>

      <!-- Top Header / Genre -->
      <div class="flex items-center justify-between z-10">
        <span
          :class="[
            'text-[9px] uppercase tracking-widest font-black px-1.5 py-0.5 rounded backdrop-blur-md',
            theme.tag
          ]"
        >
          {{ genre || 'Livro' }}
        </span>
        <span class="material-symbols-outlined text-xs opacity-60">menu_book</span>
      </div>

      <!-- Center Title & Author -->
      <div class="my-auto text-center px-1 z-10 flex flex-col items-center justify-center">
        <div :class="['w-6 h-0.5 mb-2 rounded-full opacity-60 bg-current', theme.accent]"></div>
        <h4
          :class="[
            'font-serif font-bold leading-tight tracking-tight text-white drop-shadow-sm line-clamp-3',
            size === 'sm' ? 'text-xs' : (size === 'lg' ? 'text-base' : 'text-xs sm:text-sm')
          ]"
        >
          {{ title || 'Sem Título' }}
        </h4>
        <p
          :class="[
            'font-medium opacity-80 mt-1.5 line-clamp-1',
            size === 'sm' ? 'text-[9px]' : 'text-[11px]'
          ]"
        >
          {{ author || 'Autor Desconhecido' }}
        </p>
      </div>

      <!-- Bottom Decorative Footer -->
      <div class="flex items-center justify-center z-10 opacity-50">
        <span class="text-[9px] font-mono tracking-widest uppercase">Folhear • Edition</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  coverUrl: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: '',
  },
  genre: {
    type: String,
    default: '',
  },
  isbn: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md', // 'sm' | 'md' | 'lg'
  },
  containerClass: {
    type: String,
    default: 'w-full h-full aspect-[2/3]',
  }
})

const currentSrcIndex = ref(0)
const hasAllFailed = ref(false)

// Convert ISBN-13 to ISBN-10 for Amazon CDN lookup
function isbn13To10(isbn13) {
  const clean = (isbn13 || '').replace(/[^0-9]/g, '')
  if (clean.length !== 13 || !clean.startsWith('978')) return clean
  const core = clean.substring(3, 12)
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(core[i]) * (10 - i)
  }
  const remainder = (11 - (sum % 11)) % 11
  const checkDigit = remainder === 10 ? 'X' : String(remainder)
  return core + checkDigit
}

// Generate candidate fallback cover URLs
const candidateUrls = computed(() => {
  const urls = []
  if (props.coverUrl && typeof props.coverUrl === 'string' && props.coverUrl.trim()) {
    urls.push(props.coverUrl.trim())
  }

  const cleanIsbn = (props.isbn || '').replace(/[^0-9X]/gi, '')
  if (cleanIsbn) {
    // 1. Open Library High-Res
    urls.push(`https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg?default=false`)
    // 2. Amazon Books CDN
    const isbn10 = isbn13To10(cleanIsbn)
    if (isbn10 && isbn10.length === 10) {
      urls.push(`https://images-na.ssl-images-amazon.com/images/P/${isbn10}.01.LZZZZZZZ.jpg`)
    }
    // 3. Google Books Content API
    urls.push(`https://books.google.com/books/content?vid=isbn${cleanIsbn}&printsec=frontcover&img=1&zoom=1`)
  }

  return urls
})

const currentSrc = computed(() => {
  if (candidateUrls.value.length === 0) return ''
  return candidateUrls.value[currentSrcIndex.value] || ''
})

watch(
  () => [props.coverUrl, props.isbn],
  () => {
    currentSrcIndex.value = 0
    hasAllFailed.value = candidateUrls.value.length === 0
  },
  { immediate: true }
)

function handleImageError() {
  if (currentSrcIndex.value < candidateUrls.value.length - 1) {
    currentSrcIndex.value++
  } else {
    hasAllFailed.value = true
  }
}

function handleImageLoad(e) {
  // Check if Open Library or Amazon returned a 1x1 transparent placeholder
  if (e.target && (e.target.naturalWidth <= 1 || e.target.naturalHeight <= 1)) {
    handleImageError()
  }
}

// Deterministic rich color palette based on title string hash
const colorThemes = [
  { bg: 'from-slate-900 to-slate-950', text: 'text-amber-200', accent: 'border-amber-400/40', tag: 'bg-amber-400/20 text-amber-200' },
  { bg: 'from-blue-900 to-indigo-950', text: 'text-blue-100', accent: 'border-blue-400/40', tag: 'bg-blue-400/20 text-blue-200' },
  { bg: 'from-emerald-900 to-teal-950', text: 'text-emerald-100', accent: 'border-emerald-400/40', tag: 'bg-emerald-400/20 text-emerald-200' },
  { bg: 'from-rose-900 to-red-950', text: 'text-rose-100', accent: 'border-rose-400/40', tag: 'bg-rose-400/20 text-rose-200' },
  { bg: 'from-purple-900 to-violet-950', text: 'text-purple-100', accent: 'border-purple-400/40', tag: 'bg-purple-400/20 text-purple-200' },
  { bg: 'from-amber-900 to-stone-950', text: 'text-amber-100', accent: 'border-amber-400/40', tag: 'bg-amber-400/20 text-amber-200' },
  { bg: 'from-cyan-950 to-slate-950', text: 'text-cyan-100', accent: 'border-cyan-400/40', tag: 'bg-cyan-400/20 text-cyan-200' },
]

const theme = computed(() => {
  const str = (props.title || '') + (props.genre || '')
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % colorThemes.length
  return colorThemes[index]
})
</script>
