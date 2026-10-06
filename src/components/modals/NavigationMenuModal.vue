<template>
  <div class="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm animate-fade-in select-none">
    <!-- Backdrop dismiss area -->
    <div class="flex-1" @click="store.closeModal"></div>

    <!-- Drawer Panel sliding from left -->
    <div
      class="absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-right z-50"
      style="padding-bottom: env(safe-area-inset-bottom, 16px);"
    >
      <!-- Top Brand & User Card -->
      <div class="p-5 bg-gradient-to-br from-primary to-slate-900 text-white flex flex-col gap-4">
        <!-- Top bar: Logo + Close -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 cursor-pointer" @click="navigateTo('/estante')">
            <span class="material-symbols-outlined text-amber-400 text-2xl">auto_stories</span>
            <span class="font-black text-lg tracking-tight text-white">Folhear</span>
          </div>
          <button
            @click="store.closeModal"
            class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="Fechar Menu"
          >
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <!-- User Profile Header Card in Drawer -->
        <div
          @click="openProfile"
          class="flex items-center gap-3 p-3 rounded-2xl bg-white/10 hover:bg-white/15 transition-all cursor-pointer border border-white/10"
          title="Ver Meu Perfil"
        >
          <!-- Avatar -->
          <div class="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-black text-sm shadow-md border-2 border-white/30 shrink-0 overflow-hidden">
            <img
              v-if="store.userProfile.avatarUrl"
              :src="store.userProfile.avatarUrl"
              class="w-full h-full object-cover"
            />
            <span v-else>{{ store.profileInitials }}</span>
          </div>

          <!-- User Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-sm text-white truncate block">
                {{ store.userProfile.name || 'Leitor' }}
              </span>
              <span class="material-symbols-outlined text-xs text-amber-400">verified</span>
            </div>
            <p class="text-xs text-slate-300 truncate mt-0.5">
              {{ store.userProfile.bio || 'Ver Perfil de Leitor' }}
            </p>
          </div>

          <span class="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
        </div>
      </div>

      <!-- Navigation Links Body -->
      <div class="p-4 flex-1 flex flex-col gap-5 overflow-y-auto">
        <!-- Section: Minha Biblioteca -->
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 block">
            Minha Biblioteca
          </span>
          <div class="flex flex-col gap-1">
            <!-- Estante Virtual 3D -->
            <button
              @click="navigateTo('/estante')"
              :class="[
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left font-bold text-xs transition-all',
                route.path === '/estante' ? 'bg-primary text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
              ]"
            >
              <span class="material-symbols-outlined text-lg" :class="route.path === '/estante' ? 'text-amber-400' : 'text-amber-600'">
                shelves
              </span>
              <span class="flex-1">Estante Virtual 3D</span>
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-[10px]',
                  route.path === '/estante' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                ]"
              >
                {{ store.counts.owned }}
              </span>
            </button>

            <!-- Meus Livros (Catálogo) -->
            <button
              @click="navigateTo('/livros')"
              :class="[
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left font-bold text-xs transition-all',
                route.path === '/livros' ? 'bg-primary text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
              ]"
            >
              <span class="material-symbols-outlined text-lg" :class="route.path === '/livros' ? 'text-accent' : 'text-slate-400'">
                menu_book
              </span>
              <span class="flex-1">Meus Livros (Catálogo)</span>
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-[10px]',
                  route.path === '/livros' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                ]"
              >
                {{ store.counts.owned }}
              </span>
            </button>
          </div>
        </div>

        <!-- Section: Compras & Desejos -->
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 block">
            Compras &amp; Desejos
          </span>
          <div class="flex flex-col gap-1">
            <!-- Quero Comprar -->
            <button
              @click="navigateTo('/comprar')"
              :class="[
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left font-bold text-xs transition-all',
                route.path === '/comprar' ? 'bg-primary text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
              ]"
            >
              <span class="material-symbols-outlined text-lg text-amber-600">
                shopping_bag
              </span>
              <span class="flex-1">Quero Comprar</span>
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-[10px]',
                  route.path === '/comprar' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900 font-black'
                ]"
              >
                {{ store.counts.wishlist }}
              </span>
            </button>

            <!-- Radar de Ofertas -->
            <button
              @click="openModal('radar')"
              class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left font-bold text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-all"
            >
              <span class="material-symbols-outlined text-lg text-amber-600">
                price_check
              </span>
              <span class="flex-1">Radar de Preços &amp; Ofertas</span>
              <span class="px-2 py-0.5 rounded-full text-[9px] bg-amber-100 text-amber-900 font-extrabold uppercase">
                Ao Vivo
              </span>
            </button>
          </div>
        </div>

        <!-- Section: Ações Rápidas & Painel -->
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 block">
            Ações &amp; Ferramentas
          </span>
          <div class="flex flex-col gap-1">
            <!-- Adicionar Livro -->
            <button
              @click="openModal('add')"
              class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left font-bold text-xs text-accent hover:bg-blue-50 transition-all"
            >
              <span class="material-symbols-outlined text-lg">add_circle</span>
              <span>Cadastrar Novo Livro</span>
            </button>

            <!-- Scanner -->
            <button
              @click="openModal('scanner')"
              class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left font-bold text-xs text-slate-700 hover:bg-slate-100 transition-all"
            >
              <span class="material-symbols-outlined text-lg text-accent">barcode_scanner</span>
              <span>Escanear Código de Barras</span>
            </button>

            <!-- Estatísticas -->
            <button
              @click="openModal('stats')"
              class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left font-bold text-xs text-slate-700 hover:bg-slate-100 transition-all"
            >
              <span class="material-symbols-outlined text-lg text-slate-500">analytics</span>
              <span>Painel de Estatísticas</span>
            </button>

            <!-- Meu Perfil -->
            <button
              @click="openProfile"
              class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left font-bold text-xs text-slate-700 hover:bg-slate-100 transition-all"
            >
              <span class="material-symbols-outlined text-lg text-slate-500">person</span>
              <span>Meu Perfil de Leitor</span>
            </button>

            <!-- Backup -->
            <button
              @click="openModal('backup')"
              class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left font-bold text-xs text-slate-700 hover:bg-slate-100 transition-all"
            >
              <span class="material-symbols-outlined text-lg text-slate-500">cloud_sync</span>
              <span>Backup &amp; Exportação</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Drawer Footer -->
      <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>Folhear • v1.2</span>
        <span>{{ store.stats.readCount }}/{{ store.yearlyGoal }} livros lidos</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useBookStore } from '@/store/bookStore'

const route = useRoute()
const router = useRouter()
const store = useBookStore()

function navigateTo(path) {
  store.closeModal()
  router.push(path)
}

function openModal(modalName) {
  store.openModal(modalName)
}

function openProfile() {
  store.openModal('profile')
}
</script>

<style scoped>
@keyframes slideRight {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-slide-right {
  animation: slideRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
