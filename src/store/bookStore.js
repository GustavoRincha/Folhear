import { defineStore } from 'pinia'
import { storageService } from '@/services/storageService'

const STORAGE_KEY = 'folhear_library_books_v1'
const PROFILE_STORAGE_KEY = 'folhear_user_profile_v1'

const SAMPLE_BOOK_IDS = new Set(['book-1', 'book-2', 'book-3', 'book-4', 'book-5', 'book-6', 'book-7', 'book-8'])

export const useBookStore = defineStore('bookStore', {
  state: () => ({
    books: [],
    activeFilter: 'all', // 'all' | 'reading' | 'read' | 'to-read' | 'physical' | 'wishlist'
    searchQuery: '',
    selectedGenre: 'Todos',
    sortBy: 'modified', // 'modified' | 'title' | 'author' | 'rating' | 'progress'
    viewMode: 'grid', // 'grid' | 'list'
    selectedBook: null,
    activeModal: null, // 'details' | 'add' | 'scanner' | 'stats' | 'backup' | 'radar' | 'menu' | 'profile'
    yearlyGoal: 20,
    userProfile: {
      name: 'Leitor',
      bio: 'Explorando novos mundos através dos livros.',
      avatarUrl: '',
      favoriteGenre: 'Ficção Científica',
      memberSince: '2026',
    },
    notification: null,
  }),

  getters: {
    profileInitials: (state) => {
      const name = state.userProfile?.name?.trim() || 'FL'
      const parts = name.split(' ').filter(Boolean)
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
      }
      return (name.substring(0, 2) || 'FL').toUpperCase()
    },
    counts: (state) => {
      const owned = state.books.filter(b => b.status !== 'wishlist')
      return {
        all: state.books.length,
        owned: owned.length,
        reading: state.books.filter(b => b.status === 'reading').length,
        read: state.books.filter(b => b.status === 'read').length,
        toRead: state.books.filter(b => b.status === 'to-read').length,
        physical: state.books.filter(b => b.status === 'physical').length,
        wishlist: state.books.filter(b => b.status === 'wishlist').length,
      }
    },

    ownedBooks: (state) => {
      return state.books.filter(b => b.status !== 'wishlist')
    },

    wishlistBooks: (state) => {
      return state.books.filter(b => b.status === 'wishlist')
    },

    genres: (state) => {
      const set = new Set(state.books.map(b => b.genre).filter(Boolean))
      return ['Todos', ...Array.from(set).sort()]
    },

    filteredBooks: (state) => {
      let list = [...state.books]

      // Filter by status tab
      if (state.activeFilter !== 'all') {
        list = list.filter(b => b.status === state.activeFilter)
      }

      // Filter by Genre
      if (state.selectedGenre && state.selectedGenre !== 'Todos') {
        list = list.filter(b => b.genre === state.selectedGenre)
      }

      // Filter by Search Query (Title, Author, Genre, ISBN)
      if (state.searchQuery && state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase().trim()
        list = list.filter(b => 
          (b.title && b.title.toLowerCase().includes(query)) ||
          (b.author && b.author.toLowerCase().includes(query)) ||
          (b.genre && b.genre.toLowerCase().includes(query)) ||
          (b.isbn && b.isbn.includes(query))
        )
      }

      // Sort
      list.sort((a, b) => {
        if (state.sortBy === 'title') {
          return (a.title || '').localeCompare(b.title || '')
        }
        if (state.sortBy === 'author') {
          return (a.author || '').localeCompare(b.author || '')
        }
        if (state.sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0)
        }
        if (state.sortBy === 'progress') {
          const progA = a.totalPages ? ((a.currentPage || 0) / a.totalPages) : 0
          const progB = b.totalPages ? ((b.currentPage || 0) / b.totalPages) : 0
          return progB - progA
        }
        // Default: modified date
        return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
      })

      return list
    },

    filteredOwnedBooks: (state) => {
      let list = state.books.filter(b => b.status !== 'wishlist')

      // Filter by active status if specified and not 'all'
      if (state.activeFilter !== 'all' && state.activeFilter !== 'wishlist') {
        list = list.filter(b => b.status === state.activeFilter)
      }

      // Filter by Genre
      if (state.selectedGenre && state.selectedGenre !== 'Todos') {
        list = list.filter(b => b.genre === state.selectedGenre)
      }

      // Filter by Search Query
      if (state.searchQuery && state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase().trim()
        list = list.filter(b => 
          (b.title && b.title.toLowerCase().includes(query)) ||
          (b.author && b.author.toLowerCase().includes(query)) ||
          (b.genre && b.genre.toLowerCase().includes(query)) ||
          (b.isbn && b.isbn.includes(query))
        )
      }

      // Sort
      list.sort((a, b) => {
        if (state.sortBy === 'title') return (a.title || '').localeCompare(b.title || '')
        if (state.sortBy === 'author') return (a.author || '').localeCompare(b.author || '')
        if (state.sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
        if (state.sortBy === 'progress') {
          const progA = a.totalPages ? ((a.currentPage || 0) / a.totalPages) : 0
          const progB = b.totalPages ? ((b.currentPage || 0) / b.totalPages) : 0
          return progB - progA
        }
        return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
      })

      return list
    },

    filteredWishlistBooks: (state) => {
      let list = state.books.filter(b => b.status === 'wishlist')

      // Filter by Genre
      if (state.selectedGenre && state.selectedGenre !== 'Todos') {
        list = list.filter(b => b.genre === state.selectedGenre)
      }

      // Filter by Search Query
      if (state.searchQuery && state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase().trim()
        list = list.filter(b => 
          (b.title && b.title.toLowerCase().includes(query)) ||
          (b.author && b.author.toLowerCase().includes(query)) ||
          (b.genre && b.genre.toLowerCase().includes(query)) ||
          (b.isbn && b.isbn.includes(query))
        )
      }

      // Sort
      list.sort((a, b) => {
        if (state.sortBy === 'price-asc') return (a.price || 0) - (b.price || 0)
        if (state.sortBy === 'price-desc') return (b.price || 0) - (a.price || 0)
        if (state.sortBy === 'title') return (a.title || '').localeCompare(b.title || '')
        if (state.sortBy === 'author') return (a.author || '').localeCompare(b.author || '')
        return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
      })

      return list
    },

    stats: (state) => {
      const readBooks = state.books.filter(b => b.status === 'read')
      const readingBooks = state.books.filter(b => b.status === 'reading')
      const totalPagesRead = state.books.reduce((acc, b) => {
        if (b.status === 'read') return acc + (b.totalPages || 0)
        if (b.status === 'reading') return acc + (b.currentPage || 0)
        return acc
      }, 0)

      const totalWishlistValue = state.books
        .filter(b => b.status === 'wishlist')
        .reduce((acc, b) => acc + (b.price || 0), 0)

      const goalProgress = Math.min(100, Math.round((readBooks.length / state.yearlyGoal) * 100))

      return {
        totalBooks: state.books.length,
        ownedCount: state.books.filter(b => b.status !== 'wishlist').length,
        readCount: readBooks.length,
        readingCount: readingBooks.length,
        toReadCount: state.books.filter(b => b.status === 'to-read').length,
        physicalCount: state.books.filter(b => b.status === 'physical').length,
        wishlistCount: state.books.filter(b => b.status === 'wishlist').length,
        totalPagesRead,
        totalWishlistValue,
        yearlyGoal: state.yearlyGoal,
        goalProgress,
      }
    }
  },

  actions: {
    initStore() {
      try {
        const stored = storageService.getItem(STORAGE_KEY)
        if (stored && Array.isArray(stored)) {
          // Remove automaticamente qualquer livro mock de exemplo antigo
          const cleaned = stored.filter(b => !SAMPLE_BOOK_IDS.has(b.id))
          this.books = cleaned
          this.saveToStorage()
        } else {
          this.books = []
          this.saveToStorage()
        }

        // Carregar perfil do leitor
        const storedProfile = storageService.getItem(PROFILE_STORAGE_KEY)
        if (storedProfile && typeof storedProfile === 'object') {
          this.userProfile = { ...this.userProfile, ...storedProfile }
          if (storedProfile.yearlyGoal) {
            this.yearlyGoal = Number(storedProfile.yearlyGoal)
          }
        }
      } catch (e) {
        console.error('Falha ao inicializar dados da store:', e)
        this.books = []
      }
    },

    saveToStorage() {
      storageService.setItem(STORAGE_KEY, this.books)
    },

    updateProfile(profileData) {
      this.userProfile = {
        ...this.userProfile,
        ...profileData
      }
      if (profileData.yearlyGoal !== undefined) {
        this.yearlyGoal = Math.max(1, Number(profileData.yearlyGoal))
      }
      storageService.setItem(PROFILE_STORAGE_KEY, {
        ...this.userProfile,
        yearlyGoal: this.yearlyGoal
      })
      this.showNotification('Perfil atualizado com sucesso!')
    },

    setFilter(filter) {
      this.activeFilter = filter
    },

    setSearchQuery(q) {
      this.searchQuery = q
    },

    setGenre(genre) {
      this.selectedGenre = genre
    },

    setSortBy(sort) {
      this.sortBy = sort
    },

    setViewMode(mode) {
      this.viewMode = mode
    },

    openModal(modalName, book = null) {
      this.activeModal = modalName
      this.selectedBook = book ? { ...book } : null
    },

    closeModal() {
      this.activeModal = null
      this.selectedBook = null
    },

    showNotification(message, type = 'success') {
      this.notification = { message, type, id: Date.now() }
      setTimeout(() => {
        if (this.notification && this.notification.id === this.notification.id) {
          this.notification = null
        }
      }, 3500)
    },

    addBook(bookData) {
      const newBook = {
        id: `book-${Date.now()}`,
        title: bookData.title || 'Sem Título',
        author: bookData.author || 'Autor Desconhecido',
        genre: bookData.genre || 'Geral',
        format: bookData.format || 'physical',
        status: bookData.status || 'to-read',
        currentPage: Number(bookData.currentPage) || 0,
        totalPages: Number(bookData.totalPages) || 0,
        rating: Number(bookData.rating) || 0,
        price: Number(bookData.price) || 0,
        coverUrl: bookData.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
        description: bookData.description || '',
        notes: bookData.notes || '',
        isbn: bookData.isbn || '',
        startDate: bookData.status === 'reading' ? (bookData.startDate || new Date().toISOString().split('T')[0]) : null,
        finishDate: bookData.status === 'read' ? (bookData.finishDate || new Date().toISOString().split('T')[0]) : null,
        favorite: !!bookData.favorite,
        updatedAt: new Date().toISOString(),
      }

      this.books.unshift(newBook)
      this.saveToStorage()
      this.showNotification(`"${newBook.title}" adicionado com sucesso!`)
      return newBook
    },

    updateBook(id, updates) {
      const index = this.books.findIndex(b => b.id === id)
      if (index !== -1) {
        const current = this.books[index]
        const updated = {
          ...current,
          ...updates,
          updatedAt: new Date().toISOString(),
        }

        // Auto transition status if currentPage matches totalPages
        if (updated.totalPages > 0 && updated.currentPage >= updated.totalPages && updated.status === 'reading') {
          updated.status = 'read'
          if (!updated.finishDate) {
            updated.finishDate = new Date().toISOString().split('T')[0]
          }
        }

        this.books[index] = updated
        this.saveToStorage()
        if (this.selectedBook && this.selectedBook.id === id) {
          this.selectedBook = { ...updated }
        }
        this.showNotification(`Livro "${updated.title}" atualizado!`)
      }
    },

    deleteBook(id) {
      const book = this.books.find(b => b.id === id)
      const title = book ? book.title : 'Livro'
      this.books = this.books.filter(b => b.id !== id)
      this.saveToStorage()
      this.closeModal()
      this.showNotification(`"${title}" foi removido da estante.`, 'info')
    },

    updateProgress(id, currentPage) {
      const page = Math.max(0, Number(currentPage))
      this.updateBook(id, { currentPage: page })
    },

    moveToOwned(id, targetStatus = 'physical') {
      const book = this.books.find(b => b.id === id)
      if (book) {
        this.updateBook(id, {
          status: targetStatus,
          format: book.format || 'physical'
        })
        const statusLabel = targetStatus === 'reading' ? 'Lendo Agora' : (targetStatus === 'physical' ? 'sua Estante' : 'Quero Ler')
        this.showNotification(`🎉 Parabéns! "${book.title}" agora está em ${statusLabel}!`, 'success')
      }
    },

    moveToWishlist(id) {
      const book = this.books.find(b => b.id === id)
      if (book) {
        this.updateBook(id, { status: 'wishlist' })
        this.showNotification(`"${book.title}" movido para a lista Quero Comprar.`, 'info')
      }
    },

    exportBackup() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.books, null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute("href", dataStr)
      downloadAnchor.setAttribute("download", `folhear_biblioteca_backup_${new Date().toISOString().split('T')[0]}.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
      this.showNotification('Backup exportado com sucesso!')
    },

    importBackup(jsonData) {
      try {
        const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
        if (Array.isArray(parsed)) {
          this.books = parsed
          this.saveToStorage()
          this.showNotification(`${parsed.length} livros importados com sucesso!`)
          return true
        }
        throw new Error('Formato inválido')
      } catch (e) {
        console.error(e)
        this.showNotification('Arquivo de backup inválido!', 'error')
        return false
      }
    },

    resetToDefault() {
      this.books = []
      this.saveToStorage()
      this.showNotification('Biblioteca limpa com sucesso.')
    },

    clearAllBooks() {
      this.books = []
      this.saveToStorage()
      this.showNotification('Todos os livros foram removidos da estante.', 'info')
    }
  }
})
