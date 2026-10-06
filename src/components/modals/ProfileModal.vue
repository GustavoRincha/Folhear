<template>
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
    <!-- Modal Card / Bottom Sheet -->
    <div
      class="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all"
      style="padding-bottom: env(safe-area-inset-bottom, 0px);"
    >
      <!-- Header -->
      <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <span class="material-symbols-outlined text-xl">account_circle</span>
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-bold text-[#0F172A]">Meu Perfil de Leitor</h3>
            <p class="text-[11px] text-slate-400">Personalize seus dados e metas de leitura</p>
          </div>
        </div>

        <button
          @click="store.closeModal"
          class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#0F172A] flex items-center justify-center transition-colors"
          title="Fechar"
        >
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <!-- Body Scrollable -->
      <div class="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-5">
        <!-- Top Profile Visual Card -->
        <div class="bg-gradient-to-br from-slate-900 to-primary p-5 rounded-2xl text-white flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-md relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-accent/20 rounded-full blur-xl pointer-events-none"></div>

          <!-- Avatar with photo upload -->
          <div class="relative shrink-0 group cursor-pointer" @click="$refs.avatarFileInput.click()">
            <div class="w-20 h-20 rounded-full bg-accent text-white flex items-center justify-center text-2xl font-black shadow-lg border-2 border-white/40 overflow-hidden">
              <img
                v-if="profileForm.avatarUrl"
                :src="profileForm.avatarUrl"
                class="w-full h-full object-cover"
              />
              <span v-else>{{ initials }}</span>
            </div>

            <div class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="material-symbols-outlined text-white text-lg">photo_camera</span>
            </div>

            <input
              ref="avatarFileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarUpload"
            />
          </div>

          <!-- User Display Info -->
          <div class="flex-1 text-center sm:text-left min-w-0">
            <div class="flex items-center justify-center sm:justify-start gap-1.5">
              <h4 class="text-lg font-bold text-white truncate">{{ profileForm.name || 'Leitor Folhear' }}</h4>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Nível {{ readerLevel }}
              </span>
            </div>
            <p class="text-xs text-slate-300 mt-1 line-clamp-2">{{ profileForm.bio || 'Sem biografia definida' }}</p>
            <div class="flex items-center justify-center sm:justify-start gap-2 mt-2 text-[11px] text-slate-400">
              <span>📚 {{ store.stats.readCount }} lidos</span>
              <span>•</span>
              <span>📖 {{ store.stats.totalPagesRead }} págs</span>
            </div>
          </div>
        </div>

        <!-- Annual Reading Goal Editor -->
        <div class="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-accent text-xl">emoji_events</span>
              <div>
                <h4 class="font-bold text-xs sm:text-sm text-[#0F172A]">Meta de Leitura Anual</h4>
                <p class="text-[10px] text-slate-500">Defina quantos livros planeja ler neste ano</p>
              </div>
            </div>

            <!-- Target Goal Input -->
            <div class="flex items-center gap-1 bg-white p-1 rounded-xl border border-blue-200">
              <button
                type="button"
                @click="profileForm.yearlyGoal = Math.max(1, profileForm.yearlyGoal - 1)"
                class="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
              >
                -
              </button>
              <input
                v-model.number="profileForm.yearlyGoal"
                type="number"
                min="1"
                max="999"
                class="w-10 text-center text-xs font-black text-[#0F172A] outline-none"
              />
              <button
                type="button"
                @click="profileForm.yearlyGoal = profileForm.yearlyGoal + 1"
                class="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
              >
                +
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-blue-200/60 h-2.5 rounded-full overflow-hidden">
            <div
              class="h-full bg-accent rounded-full transition-all duration-500"
              :style="{ width: `${goalProgress}%` }"
            ></div>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-600">
            <span>{{ store.stats.readCount }} de {{ profileForm.yearlyGoal }} livros concluídos</span>
            <span class="font-extrabold text-accent">{{ goalProgress }}%</span>
          </div>
        </div>

        <!-- Editable Form Fields -->
        <div class="flex flex-col gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Seu Nome / Apelido</label>
            <input
              v-model="profileForm.name"
              type="text"
              placeholder="Digite seu nome..."
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-[#0F172A] focus:ring-2 focus:ring-accent focus:bg-white outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Biografia / Citação Favorita</label>
            <textarea
              v-model="profileForm.bio"
              rows="2"
              placeholder="Uma frase marcante ou sobre seus gostos de leitura..."
              class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0F172A] focus:ring-2 focus:ring-accent focus:bg-white outline-none resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Gênero Literário Preferido</label>
            <input
              v-model="profileForm.favoriteGenre"
              type="text"
              placeholder="Ex: Ficção Científica, Fantasia, Clássicos..."
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-[#0F172A] focus:ring-2 focus:ring-accent focus:bg-white outline-none"
            />
          </div>
        </div>

        <!-- Badges & Conquistas Literárias -->
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Conquistas Desbloqueadas
          </span>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="badge in readerBadges"
              :key="badge.id"
              class="p-2.5 rounded-xl border flex items-center gap-2.5 transition-all"
              :class="[
                badge.unlocked
                  ? 'bg-amber-50/50 border-amber-200 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              ]"
            >
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                :class="badge.unlocked ? 'bg-amber-400/20 text-amber-600' : 'bg-slate-200 text-slate-400'"
              >
                <span class="material-symbols-outlined text-lg">{{ badge.icon }}</span>
              </div>
              <div class="min-w-0">
                <span class="text-xs font-bold block truncate">{{ badge.title }}</span>
                <span class="text-[10px] block truncate opacity-75">{{ badge.desc }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="p-4 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50 shrink-0">
        <button
          type="button"
          @click="store.closeModal"
          class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100"
        >
          Cancelar
        </button>

        <button
          type="button"
          @click="saveProfile"
          class="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-slate-900 shadow-md flex items-center gap-1.5 active:scale-95"
        >
          <span class="material-symbols-outlined text-sm">check</span>
          <span>Salvar Perfil</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useBookStore } from '@/store/bookStore'

const store = useBookStore()

const profileForm = reactive({
  name: store.userProfile.name || 'Leitor',
  bio: store.userProfile.bio || 'Explorando novos mundos através dos livros.',
  avatarUrl: store.userProfile.avatarUrl || '',
  favoriteGenre: store.userProfile.favoriteGenre || 'Ficção Científica',
  yearlyGoal: store.yearlyGoal || 20,
})

const initials = computed(() => {
  const n = profileForm.name.trim() || 'FL'
  const parts = n.split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return (n.substring(0, 2) || 'FL').toUpperCase()
})

const goalProgress = computed(() => {
  const goal = Number(profileForm.yearlyGoal) || 1
  return Math.min(100, Math.round((store.stats.readCount / goal) * 100))
})

const readerLevel = computed(() => {
  const read = store.stats.readCount
  if (read >= 20) return 5
  if (read >= 10) return 4
  if (read >= 5) return 3
  if (read >= 1) return 2
  return 1
})

const readerBadges = computed(() => {
  const read = store.stats.readCount
  const pages = store.stats.totalPagesRead
  const total = store.stats.totalBooks

  return [
    {
      id: 'first',
      title: 'Primeiro Livro',
      desc: 'Concluiu a 1ª leitura',
      icon: 'military_tech',
      unlocked: read >= 1
    },
    {
      id: 'marathon',
      title: 'Maratona 500p',
      desc: 'Leu mais de 500 páginas',
      icon: 'speed',
      unlocked: pages >= 500
    },
    {
      id: 'shelf',
      title: 'Bibliotecário',
      desc: 'Acervo com 5+ obras',
      icon: 'shelves',
      unlocked: total >= 5
    },
    {
      id: 'goal',
      title: 'Mestre da Meta',
      desc: 'Atingiu a meta anual',
      icon: 'workspace_premium',
      unlocked: read >= profileForm.yearlyGoal
    }
  ]
})

function handleAvatarUpload(event) {
  const file = event.target?.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    profileForm.avatarUrl = e.target.result
    store.showNotification('Foto de perfil carregada!', 'success')
  }
  reader.readAsDataURL(file)
}

function saveProfile() {
  store.updateProfile({
    name: profileForm.name,
    bio: profileForm.bio,
    avatarUrl: profileForm.avatarUrl,
    favoriteGenre: profileForm.favoriteGenre,
    yearlyGoal: profileForm.yearlyGoal
  })
  store.closeModal()
}
</script>
