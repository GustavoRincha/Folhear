<template>
  <div class="bg-background text-on-background font-sans min-h-screen flex flex-col md:flex-row pb-24 md:pb-8">
    <!-- Desktop Fixed Sidebar -->
    <AppSidebar />

    <!-- Main Content Area -->
    <main class="flex-1 md:ml-[260px] min-h-screen bg-background flex flex-col">
      <!-- Top Header -->
      <AppHeader />

      <!-- Main Container -->
      <div class="p-container-margin max-w-7xl w-full mx-auto flex flex-col gap-6">
        <!-- 3D Virtual Bookshelf Master Component -->
        <VirtualBookshelf />
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <BottomNav />

    <!-- Modals -->
    <AddBookModal v-if="store.activeModal === 'add' || store.activeModal === 'scanner'" />
    <BookDetailsModal v-if="store.activeModal === 'details'" />
    <StatsModal v-if="store.activeModal === 'stats'" />
    <BackupModal v-if="store.activeModal === 'backup'" />
    <PriceRadarModal v-if="store.activeModal === 'radar'" />
    <NavigationMenuModal v-if="store.activeModal === 'menu'" />
    <ProfileModal v-if="store.activeModal === 'profile'" />

    <!-- Toast Notification -->
    <transition name="fade">
      <div
        v-if="store.notification"
        class="fixed bottom-24 md:bottom-8 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium border border-slate-700 animate-slide-up"
      >
        <span
          class="material-symbols-outlined text-lg"
          :class="store.notification.type === 'error' ? 'text-red-400' : 'text-emerald-400'"
        >
          {{ store.notification.type === 'error' ? 'error' : 'check_circle' }}
        </span>
        <span>{{ store.notification.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBookStore } from '@/store/bookStore'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import VirtualBookshelf from '@/components/bookshelf/VirtualBookshelf.vue'
import AddBookModal from '@/components/modals/AddBookModal.vue'
import BookDetailsModal from '@/components/modals/BookDetailsModal.vue'
import StatsModal from '@/components/modals/StatsModal.vue'
import BackupModal from '@/components/modals/BackupModal.vue'
import PriceRadarModal from '@/components/modals/PriceRadarModal.vue'
import NavigationMenuModal from '@/components/modals/NavigationMenuModal.vue'
import ProfileModal from '@/components/modals/ProfileModal.vue'

const store = useBookStore()

onMounted(() => {
  store.initStore()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
