<template>
  <div class="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest overflow-hidden">
    <!-- Header Section -->
    <div class="p-4 bg-surface-container-low/60 border-b border-surface-variant flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-amber-600 text-lg">local_offer</span>
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-on-surface">Comparador de Preços</h4>
          <p class="text-[11px] text-outline">Pesquisa em tempo real nas principais lojas</p>
        </div>
      </div>

      <button
        type="button"
        @click="fetchPrices"
        :disabled="loading"
        class="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface-variant flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-60"
        title="Recarregar preços"
      >
        <span class="material-symbols-outlined text-sm" :class="{ 'animate-spin': loading }">
          {{ loading ? 'progress_activity' : 'refresh' }}
        </span>
        <span>{{ hasSearched ? 'Atualizar' : 'Buscar Preços' }}</span>
      </button>
    </div>

    <!-- Content Area -->
    <div class="p-4 flex flex-col gap-3">
      <!-- State: Not searched yet -->
      <div v-if="!hasSearched && !loading" class="text-center py-4 flex flex-col items-center gap-2">
        <div class="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-700">
          <span class="material-symbols-outlined">query_stats</span>
        </div>
        <p class="text-xs text-on-surface-variant max-w-sm">
          Consulte o menor preço atualizado para <strong>{{ book.title }}</strong> na Amazon, Estante Virtual e Mercado Livre.
        </p>
        <button
          type="button"
          @click="fetchPrices"
          class="mt-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all transform active:scale-95"
        >
          <span class="material-symbols-outlined text-sm">search</span>
          Buscar Melhores Ofertas
        </button>
      </div>

      <!-- State: Loading -->
      <div v-else-if="loading" class="py-6 flex flex-col items-center justify-center gap-2">
        <span class="material-symbols-outlined animate-spin text-2xl text-amber-600">progress_activity</span>
        <span class="text-xs font-medium text-outline">Rastreando preços na Estante Virtual, Amazon e Mercado Livre...</span>
      </div>

      <!-- State: Results -->
      <div v-else class="flex flex-col gap-3 animate-fade-in">
        <!-- Best Deal Alert Banner -->
        <div
          v-if="priceData && priceData.lowestPrice"
          class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
        >
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-base">savings</span>
            </div>
            <div>
              <div class="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                Melhor Oferta Encontrada:
                <span class="text-sm font-extrabold text-emerald-700">{{ priceData.lowestPriceFormatted }}</span>
              </div>
              <p class="text-[11px] text-emerald-800">
                Disponível na <strong>{{ priceData.bestDealStore }}</strong>
              </p>
            </div>
          </div>

          <button
            v-if="priceData.lowestPrice && book.price !== priceData.lowestPrice"
            type="button"
            @click="applyBestPrice"
            class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm shrink-0"
            title="Salvar este valor no cadastro do livro"
          >
            <span class="material-symbols-outlined text-xs">done_all</span>
            <span>Salvar no Livro</span>
          </button>
        </div>

        <!-- Offline notice if API wasn't reachable -->
        <div v-if="priceData && !priceData.isOnline" class="p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-800 flex items-center gap-1.5">
          <span class="material-symbols-outlined text-xs">info</span>
          <span>APIFolhear offline. Exibindo atalhos de busca direta com 1 clique.</span>
        </div>

        <!-- Store Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div
            v-for="(item, idx) in priceData.results"
            :key="idx"
            class="p-3 rounded-xl border flex flex-col justify-between gap-2 transition-all hover:shadow-md"
            :class="[
              item.bestDeal
                ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-300/50'
                : 'bg-surface-container-low/40 border-outline-variant/50 hover:bg-surface-container-low'
            ]"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-base text-outline-variant">{{ item.storeIcon || 'store' }}</span>
                <div>
                  <div class="text-xs font-bold text-on-surface flex items-center gap-1">
                    {{ item.store }}
                    <span
                      v-if="item.bestDeal"
                      class="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded uppercase tracking-wider"
                    >
                      Menor Preço
                    </span>
                  </div>
                  <span class="text-[11px] text-outline line-clamp-1">{{ item.condition }}</span>
                </div>
              </div>

              <!-- Price Tag -->
              <div class="text-right shrink-0">
                <div
                  v-if="item.price !== null"
                  class="text-sm font-extrabold"
                  :class="item.bestDeal ? 'text-emerald-700' : 'text-on-surface'"
                >
                  {{ item.priceFormatted }}
                </div>
                <div v-else class="text-[11px] font-semibold text-outline">
                  {{ item.priceFormatted || 'Consultar' }}
                </div>
              </div>
            </div>

            <!-- Card Bottom: Link Button -->
            <div class="flex items-center justify-between pt-1 border-t border-surface-variant/40 mt-1">
              <span class="text-[10px] text-outline truncate max-w-[140px]">{{ item.note || 'Oferta externa' }}</span>
              <a
                :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                class="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                :class="[
                  item.bestDeal
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                    : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface'
                ]"
              >
                <span>Ver na Loja</span>
                <span class="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { priceCrawlerService } from '@/services/priceCrawlerService'

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['updatePrice'])

const loading = ref(false)
const hasSearched = ref(false)
const priceData = ref(null)

async function fetchPrices() {
  if (!props.book) return
  loading.value = true
  try {
    const result = await priceCrawlerService.getBookPrices({
      isbn: props.book.isbn,
      title: props.book.title,
      author: props.book.author
    })
    priceData.value = result
    hasSearched.value = true
  } catch (e) {
    console.error('Erro ao buscar preços:', e)
  } finally {
    loading.value = false
  }
}

function applyBestPrice() {
  if (priceData.value && priceData.value.lowestPrice) {
    emit('updatePrice', priceData.value.lowestPrice)
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.25s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
