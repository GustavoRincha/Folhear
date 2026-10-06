<template>
  <div class="w-full flex flex-col gap-6 select-none">
    <!-- Bookshelf Top Control Toolbar -->
    <div class="flex flex-wrap items-center justify-between gap-3 bg-white/80 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm">
      <!-- Left: View Mode Toggle (Lombadas vs Vitrine) -->
      <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          type="button"
          @click="shelfDisplayMode = 'spine'"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
            shelfDisplayMode === 'spine'
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-600 hover:text-[#0F172A]'
          ]"
          title="Ver lombadas enfileiradas como em uma estante real"
        >
          <span class="material-symbols-outlined text-base">view_column</span>
          <span>Lombadas Reais</span>
        </button>

        <button
          type="button"
          @click="shelfDisplayMode = 'front'"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
            shelfDisplayMode === 'front'
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-600 hover:text-[#0F172A]'
          ]"
          title="Ver capas de frente expostas na vitrine"
        >
          <span class="material-symbols-outlined text-base">auto_stories</span>
          <span>Vitrine 3D</span>
        </button>
      </div>

      <!-- Center / Right: Shelf Organization & Wood Theme -->
      <div class="flex items-center gap-2 flex-wrap">
        <!-- Grouping Filter -->
        <div class="flex items-center gap-1.5 text-xs">
          <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px] hidden sm:inline">Organização:</span>
          <select
            v-model="shelfGrouping"
            class="py-1.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#0F172A] outline-none cursor-pointer focus:ring-2 focus:ring-accent"
          >
            <option value="status">Separar por Prateleiras de Leitura</option>
            <option value="all">Todas as Prateleiras Contínuas</option>
            <option value="genre">Separar por Gêneros</option>
          </select>
        </div>

        <!-- Wood Texture Selector -->
        <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            v-for="wood in woodThemes"
            :key="wood.id"
            type="button"
            @click="activeWood = wood.id"
            :class="[
              'w-6 h-6 rounded-lg transition-all flex items-center justify-center border',
              activeWood === wood.id ? 'ring-2 ring-accent scale-110 border-white' : 'border-transparent opacity-80 hover:opacity-100'
            ]"
            :style="{ background: wood.swatch }"
            :title="wood.label"
          >
            <span v-if="activeWood === wood.id" class="w-1.5 h-1.5 rounded-full bg-white shadow-sm"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main 3D Bookshelf Cabinet Unit -->
    <div
      class="w-full rounded-3xl overflow-hidden shadow-2xl border-4 transition-colors duration-500 relative"
      :style="{
        backgroundColor: currentWood.cabinetBg,
        borderColor: currentWood.cabinetBorder,
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4), inset 0 2px 8px rgba(255,255,255,0.1)'
      }"
    >
      <!-- Top Bookshelf Header Cornice (Moldura superior em madeira) -->
      <div
        class="w-full h-8 relative shadow-md flex items-center justify-between px-6 border-b"
        :style="{
          background: currentWood.corniceGradient,
          borderColor: currentWood.shelfBevelBorder
        }"
      >
        <!-- Ambient Warm Spotlight (Glow que desce da moldura) -->
        <div class="absolute inset-0 bg-gradient-to-b from-amber-400/10 via-transparent to-transparent pointer-events-none"></div>

        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-amber-400/80 animate-pulse"></span>
          <span class="text-[11px] font-serif uppercase tracking-widest text-amber-200/90 font-bold drop-shadow">
            Biblioteca Folhear • Acervo Pessoal
          </span>
        </div>

        <span class="text-[11px] font-mono text-amber-200/60">
          {{ totalOwnedCount }} {{ totalOwnedCount === 1 ? 'Livro' : 'Livros' }}
        </span>
      </div>

      <!-- Bookshelf Back Wall with Shelves -->
      <div
        class="w-full p-4 sm:p-8 flex flex-col gap-10 sm:gap-14 relative"
        :style="{
          background: currentWood.backWallGradient
        }"
      >
        <!-- Background Wallpaper Subtle Vertical Striping / Wood Grain -->
        <div
          class="absolute inset-0 opacity-15 pointer-events-none"
          style="background: repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.2) 40px, rgba(0,0,0,0.2) 41px);"
        ></div>

        <!-- Render Shelf Rows -->
        <div
          v-for="(shelf, sIdx) in computedShelves"
          :key="shelf.id || sIdx"
          class="relative flex flex-col z-10"
        >
          <!-- Top Warm LED Light Strip under previous shelf/top -->
          <div class="w-full h-1 bg-gradient-to-r from-transparent via-amber-300/25 to-transparent mb-1 rounded-full blur-[1px]"></div>

          <!-- Books Lineup Area (Standing on top surface of the shelf plank) -->
          <div
            class="relative min-h-[220px] sm:min-h-[260px] flex items-end px-4 sm:px-8 pb-0 overflow-x-auto hide-scrollbar z-20"
            :class="shelfDisplayMode === 'spine' ? 'gap-1 sm:gap-1.5' : 'gap-4 sm:gap-6 justify-start'"
          >
            <!-- Left Decorative Brass Bookend (Aparador de livros esquerdo) -->
            <div
              v-if="shelf.books.length > 0"
              class="w-3 sm:w-4 h-24 rounded-tl-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 shadow-md shrink-0 mb-0 opacity-70 border-l border-amber-300 pointer-events-none"
              title="Aparador de Livros"
            ></div>

            <!-- Books in this shelf -->
            <template v-if="shelf.books.length > 0">
              <template v-if="shelfDisplayMode === 'spine'">
                <BookshelfSpine
                  v-for="(book, bIdx) in shelf.books"
                  :key="book.id"
                  :book="book"
                  :index="bIdx"
                  @select="openBookModal"
                />
              </template>
              <template v-else>
                <BookshelfFrontBook
                  v-for="(book, bIdx) in shelf.books"
                  :key="book.id"
                  :book="book"
                  :index="bIdx"
                  @select="openBookModal"
                />
              </template>
            </template>

            <!-- Empty Shelf Placeholder Slot -->
            <div
              v-else
              class="my-auto py-8 w-full flex flex-col items-center justify-center text-center opacity-75"
            >
              <span class="material-symbols-outlined text-4xl text-amber-200/50 mb-1">auto_stories</span>
              <p class="text-xs text-amber-100/70 font-medium">Nenhum livro nesta prateleira ainda</p>
              <button
                type="button"
                @click="store.openModal('add')"
                class="mt-2 px-3 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 text-xs font-bold rounded-lg border border-amber-400/30 transition-colors shadow-sm"
              >
                + Adicionar Livro
              </button>
            </div>

            <!-- Right Decorative Brass Bookend (Aparador de livros direito) -->
            <div
              v-if="shelf.books.length > 0"
              class="w-3 sm:w-4 h-24 rounded-tr-lg bg-gradient-to-l from-amber-600 via-amber-500 to-amber-700 shadow-md shrink-0 mb-0 opacity-70 border-r border-amber-300 pointer-events-none ml-2"
              title="Aparador de Livros"
            ></div>

            <!-- Quick Add Book Slot at the end of shelf -->
            <div
              v-if="shelf.books.length > 0 && shelf.books.length < 14"
              @click="store.openModal('add')"
              class="h-44 sm:h-52 w-12 sm:w-16 rounded-xl border-2 border-dashed border-amber-400/30 hover:border-amber-400/60 hover:bg-amber-400/10 flex flex-col items-center justify-center text-amber-200/60 hover:text-amber-200 transition-all cursor-pointer shrink-0 ml-3"
              title="Adicionar novo livro nesta estante"
            >
              <span class="material-symbols-outlined text-xl sm:text-2xl">add</span>
              <span class="text-[9px] uppercase tracking-wider font-bold mt-1">Novo</span>
            </div>
          </div>

          <!-- Realistic 3D Wooden Shelf Plank (O Tablado Físico da Prateleira) -->
          <div class="relative w-full z-10">
            <!-- 1. Top Flat Board (Surface where books stand) -->
            <div
              class="w-full h-4 sm:h-5 relative shadow-inner"
              :style="{
                background: currentWood.shelfTopSurface,
                boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.5)'
              }"
            ></div>

            <!-- 2. Front Edge Bevel with Wood Grain (Borda frontal grossa da madeira) -->
            <div
              class="w-full h-6 sm:h-8 relative flex items-center justify-center px-4 shadow-xl"
              :style="{
                background: currentWood.shelfFrontEdge,
                borderTop: `1px solid ${currentWood.shelfBevelBorder}`,
                borderBottom: `2px solid ${currentWood.shelfBottomBorder}`
              }"
            >
              <!-- Brass Nameplate (Plaqueta central) -->
              <div
                class="px-4 py-0.5 sm:py-1 rounded-sm bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700 shadow-md border border-amber-300/80 flex items-center gap-2 transform -translate-y-0.5"
                style="box-shadow: 0 2px 4px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.8);"
              >
                <span class="w-1 h-1 rounded-full bg-amber-900 shadow-inner"></span>
                <span class="text-[10px] sm:text-xs font-serif font-black uppercase tracking-widest text-amber-950">
                  {{ shelf.label }}
                </span>
                <span class="text-[9px] font-mono text-amber-900 font-bold">
                  ({{ shelf.books.length }})
                </span>
                <span class="w-1 h-1 rounded-full bg-amber-900 shadow-inner"></span>
              </div>
            </div>

            <!-- 3. Cast Shadow Below Shelf (Sombra projetada no vão inferior) -->
            <div
              class="w-full h-6 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none"
            ></div>
          </div>
        </div>
      </div>

      <!-- Bottom Bookshelf Baseboard (Rodapé da Estante) -->
      <div
        class="w-full h-8 relative shadow-2xl flex items-center justify-between px-6 border-t"
        :style="{
          background: currentWood.corniceGradient,
          borderColor: currentWood.shelfBevelBorder
        }"
      >
        <div class="flex items-center gap-2 text-[10px] text-amber-200/50 uppercase tracking-widest font-mono">
          <span class="material-symbols-outlined text-xs">shelves</span>
          <span>Folhear • Estante Virtual Interativa</span>
        </div>
        <div class="text-[10px] text-amber-200/60 font-serif italic">
          Passe o mouse ou toque nos livros para interagir
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBookStore } from '@/store/bookStore'
import BookshelfSpine from './BookshelfSpine.vue'
import BookshelfFrontBook from './BookshelfFrontBook.vue'

const store = useBookStore()

const shelfDisplayMode = ref('spine') // 'spine' | 'front'
const shelfGrouping = ref('status') // 'status' | 'all' | 'genre'
const activeWood = ref('mahogany') // 'mahogany' | 'oak' | 'slate'

const totalOwnedCount = computed(() => store.ownedBooks.length)

function openBookModal(book) {
  store.openModal('details', book)
}

// Grouped Shelves Definition
const computedShelves = computed(() => {
  const books = store.ownedBooks

  if (shelfGrouping.value === 'all') {
    // Break books into chunked shelves (up to 9 books per shelf)
    const chunkSize = shelfDisplayMode.value === 'spine' ? 10 : 7
    const result = []
    if (books.length === 0) {
      return [{ id: 'shelf-empty', label: 'Estante Geral', books: [] }]
    }
    for (let i = 0; i < books.length; i += chunkSize) {
      const chunk = books.slice(i, i + chunkSize)
      result.push({
        id: `shelf-${i}`,
        label: `Prateleira ${Math.floor(i / chunkSize) + 1}`,
        books: chunk
      })
    }
    return result
  }

  if (shelfGrouping.value === 'genre') {
    const genres = Array.from(new Set(books.map(b => b.genre || 'Geral'))).sort()
    return genres.map(g => ({
      id: `genre-${g}`,
      label: g,
      books: books.filter(b => (b.genre || 'Geral') === g)
    }))
  }

  // Default: By Reading Status
  const reading = books.filter(b => b.status === 'reading')
  const toRead = books.filter(b => b.status === 'to-read')
  const read = books.filter(b => b.status === 'read')
  const physical = books.filter(b => b.status === 'physical')

  const shelves = [
    {
      id: 'shelf-reading',
      label: 'Lendo no Momento',
      books: reading
    },
    {
      id: 'shelf-to-read',
      label: 'Fila de Próximas Leituras',
      books: toRead
    },
    {
      id: 'shelf-read',
      label: 'Lidos & Concluídos',
      books: read
    },
    {
      id: 'shelf-physical',
      label: 'Acervo Físico',
      books: physical
    }
  ]

  // Filter out empty shelves if there are at least some active ones, but always keep at least 2 shelves
  return shelves.filter((s, idx) => s.books.length > 0 || idx < 2)
})

// Luxury wood finishes styles
const woodThemes = [
  {
    id: 'mahogany',
    label: 'Madeira Nobre (Mogno Clássico)',
    swatch: '#4A1D11',
    cabinetBg: '#230E09',
    cabinetBorder: '#39150C',
    corniceGradient: 'linear-gradient(180deg, #5C2415 0%, #39150C 100%)',
    backWallGradient: 'radial-gradient(ellipse at top, #3D170D 0%, #1D0A05 100%)',
    shelfTopSurface: 'linear-gradient(180deg, #6E2B1A 0%, #4A1D11 100%)',
    shelfFrontEdge: 'linear-gradient(180deg, #5C2415 0%, #35130A 100%)',
    shelfBevelBorder: '#8A3721',
    shelfBottomBorder: '#1A0804'
  },
  {
    id: 'oak',
    label: 'Carvalho Escandinavo',
    swatch: '#8C6747',
    cabinetBg: '#3F2C1D',
    cabinetBorder: '#5D402B',
    corniceGradient: 'linear-gradient(180deg, #8C6747 0%, #5D402B 100%)',
    backWallGradient: 'radial-gradient(ellipse at top, #543924 0%, #2A1C11 100%)',
    shelfTopSurface: 'linear-gradient(180deg, #A8815C 0%, #7D5737 100%)',
    shelfFrontEdge: 'linear-gradient(180deg, #8C6747 0%, #543924 100%)',
    shelfBevelBorder: '#C2986E',
    shelfBottomBorder: '#2A1C11'
  },
  {
    id: 'slate',
    label: 'Ébano Moderno (Grafite)',
    swatch: '#1E293B',
    cabinetBg: '#090D16',
    cabinetBorder: '#1E293B',
    corniceGradient: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
    backWallGradient: 'radial-gradient(ellipse at top, #141B2D 0%, #07090E 100%)',
    shelfTopSurface: 'linear-gradient(180deg, #2D3748 0%, #1A202C 100%)',
    shelfFrontEdge: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
    shelfBevelBorder: '#475569',
    shelfBottomBorder: '#020617'
  }
]

const currentWood = computed(() => {
  return woodThemes.find(w => w.id === activeWood.value) || woodThemes[0]
})
</script>

<style scoped>
/* Smooth hiding of scrollbar */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
