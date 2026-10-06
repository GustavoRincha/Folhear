<template>
  <div class="min-h-screen bg-background text-on-background font-sans">
    <router-view />
  </div>
</template>

<script setup>
// Folhear - Minha Biblioteca
</script>

<style>
/* Global resets & Mobile-native feel */
html, body {
  margin: 0;
  padding: 0;
  background-color: #F7F7F8;
  font-family: 'Inter', sans-serif;
  color: #0F172A;

  /* Evita seleção acidental de texto na interface durante o toque */
  user-select: none;
  -webkit-user-select: none;

  /* Evita menu de contexto nativo ao segurar o toque em imagens e links */
  -webkit-touch-callout: none;

  /* Remove o destaque azul/cinza de toque padrão do navegador móvel */
  -webkit-tap-highlight-color: transparent;

  /* Previne o efeito indesejado de elástico / pull-to-refresh nativo do browser */
  overscroll-behavior-y: none;
}

/* Garante que campos editáveis e textos específicos continuem permitindo seleção */
input,
textarea,
[contenteditable="true"],
.selectable-text {
  user-select: text !important;
  -webkit-user-select: text !important;
}

* {
  box-sizing: border-box;
}
</style>
