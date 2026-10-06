import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isHttps = mode === 'https' || process.env.HTTPS === 'true'

  return {
    base: './',
    plugins: [
      vue(),
      vuetify({ autoImport: true }),
      ...(isHttps ? [basicSsl()] : []),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      https: isHttps,
      host: true, // expõe na rede local (0.0.0.0) para acessar via IP no celular
      port: 8080,
    }
  }
})



