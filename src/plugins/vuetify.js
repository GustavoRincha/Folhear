import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme: {
        dark: false,
        colors: {
          background: '#F7F7F8',
          surface: '#FFFFFF',
          primary: '#1E293B',
          secondary: '#3B82F6',
          accent: '#3B82F6',
          error: '#EF4444',
          info: '#3B82F6',
          success: '#059669',
          warning: '#F59E0B',
        },
      },
    },
  },
})

