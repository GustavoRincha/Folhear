# 📚 Folhear - Estante Virtual 3D & Gerenciador de Leituras

<p align="center">
  <strong>Uma experiência visual e moderna para organizar suas leituras, acompanhar metas e explorar sua biblioteca física e digital.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.3-42b883?style=flat-square&logo=vue.js&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 5" />
  <img src="https://img.shields.io/badge/Pinia-2.1-ffd859?style=flat-square&logo=pinia&logoColor=black" alt="Pinia" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="Licença MIT" />
</p>

---

## ✨ Principais Funcionalidades

- 📖 **Estante Virtual 3D Interativa:**
  - Visualização em modo **Lombadas Físicas** ou **Vitrine Frontal**.
  - Texturas de madeira luxuosas customizáveis: *Carvalho Rústico, Nogueira Clássica, Mogno Nobre e Ébano Moderno*.
  - Efeitos realistas de iluminação LED quente superior, plaquetas metálicas de latão e aparadores clássicos.
  - Destaque ao passar o mouse com card flutuante (*hover card*) rico em detalhes.

- 📷 **Scanner de Código de Barras (ISBN) com Câmera:**
  - Leitura em tempo real pela câmera do celular ou webcam.
  - Utiliza `BarcodeDetector` nativo com fallback de alta precisão via `@zxing/library`.
  - Busca automática dos dados e capa do livro logo após o bip do scanner.

- 🔍 **Busca Multiprovedor Inteligente:**
  - Consulta integrada combinando **BrasilAPI (CBL - Câmara Brasileira do Livro)**, **Open Library** e **Google Books**.
  - Sistema de resolução automática de capas em alta resolução (Open Library High-Res, Amazon CDN e Google Books).
  - Geração algorítmica de capas tipográficas exclusivas com paleta dinâmica baseada no título caso o livro não possua capa online.

- 💰 **Wishlist & Radar de Preços:**
  - Lista de desejos com orçamento total planejado.
  - Comparador de ofertas com link direto para as principais lojas: *Amazon Brasil, Estante Virtual, Mercado Livre e Google Shopping*.
  - Modo offline e fallback garantido mesmo se a API de scraping estiver indisponível.

- 🎯 **Acompanhamento de Leituras e Metas:**
  - Controle de progresso por livro (página atual / total de páginas com barra percentual).
  - Organização por status: *Lendo Agora, Lidos, Quero Ler, Acervo Físico e Wishlist*.
  - Meta anual de leitura com acompanhamento dinâmico.

- 💾 **Privacidade e Backup:**
  - Os dados ficam salvos localmente no navegador (`localStorage`), sem necessidade de criar conta externa.
  - Exportação e importação completa de backup em formato JSON a qualquer momento.

---

## 🛠️ Tecnologias Utilizadas

- **[Vue 3](https://vuejs.org/)** (Composition API, `<script setup>`)
- **[Vite 5](https://vitejs.dev/)** (Build tool ultrarrápido)
- **[Pinia 2](https://pinia.vuejs.org/)** (Gerenciamento de estado global reativo)
- **[Vue Router 4](https://router.vuejs.org/)** (Roteamento SPA)
- **[Tailwind CSS](https://tailwindcss.com/)** + **[Vuetify 3](https://vuetifyjs.com/)** (Estilização híbrida e componentes)
- **[@zxing/library](https://github.com/zxing-js/library)** (Reconhecimento ótico de códigos de barras)
- **[Axios](https://axios-http.com/)** (Requisições HTTP)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- Gerenciador de pacotes `npm`

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/GustavoRincha/Folhear.git
   cd Folhear
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Copie o arquivo de exemplo para criar seu `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação no navegador em `http://localhost:5173`.

5. **Para testar no celular com câmera (HTTPS local):**
   ```bash
   npm run dev:https
   ```

---

## 📦 Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor Vite local com acesso na rede |
| `npm run dev:https` | Inicia o servidor de desenvolvimento com suporte a SSL local (necessário para testes de câmera mobile) |
| `npm run build` | Gera os arquivos otimizados para produção na pasta `dist/` |
| `npm run preview` | Executa localmente o build de produção para testes |
| `npm run lint` | Executa o ESLint para verificar e corrigir regras de código |

---

## 🌐 Integração com a API de Preços

O front-end conta com integração opcional a um backend crawler (`APIFolhear`) via variável `VITE_API_URL`. Caso essa API não esteja em execução, o Folhear ativa automaticamente o **Modo Fallback**, gerando links inteligentes de consulta direta para os e-commerces (Amazon, Estante Virtual e Mercado Livre), garantindo que a aplicação nunca quebre.

---

## 📄 Licença

Este projeto está sob a licença [MIT](./LICENSE). Sinta-se livre para usar, modificar e contribuir!
