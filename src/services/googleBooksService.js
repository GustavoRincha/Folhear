import axios from 'axios'

const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1/volumes'
const OPEN_LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json'
const BRASIL_API_ISBN_URL = 'https://brasilapi.com.br/api/isbn/v1'

/**
 * Formata item da Open Library
 */
function formatOpenLibraryBook(doc) {
  if (!doc) return null

  let coverUrl = ''
  if (doc.cover_i) {
    coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
  } else if (doc.isbn && doc.isbn.length > 0) {
    coverUrl = `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-M.jpg`
  }

  const authors = Array.isArray(doc.author_name)
    ? doc.author_name.join(', ')
    : (doc.author_name || 'Autor Desconhecido')

  let isbn = ''
  if (Array.isArray(doc.isbn) && doc.isbn.length > 0) {
    isbn = doc.isbn[0]
  }

  let genre = 'Geral'
  if (Array.isArray(doc.subject) && doc.subject.length > 0) {
    genre = doc.subject[0].split(',')[0].trim() || 'Geral'
  }

  return {
    id: `ol-${doc.key?.replace('/works/', '') || Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    title: doc.title || 'Sem Título',
    subtitle: '',
    author: authors,
    publisher: Array.isArray(doc.publisher) ? doc.publisher[0] : (doc.publisher || ''),
    publishedDate: doc.first_publish_year ? String(doc.first_publish_year) : '',
    description: typeof doc.first_sentence === 'object' ? doc.first_sentence.value : (doc.first_sentence || ''),
    totalPages: doc.number_of_pages_median || doc.number_of_pages || 0,
    genre: genre,
    coverUrl: coverUrl,
    isbn: isbn,
    source: 'Open Library',
  }
}

/**
 * Formata item da BrasilAPI (CBL - Câmara Brasileira do Livro)
 */
function formatBrasilApiBook(data) {
  if (!data) return null

  const authors = Array.isArray(data.authors) && data.authors.length > 0
    ? data.authors.join(', ')
    : 'Autor Desconhecido'

  let genre = 'Literatura'
  if (Array.isArray(data.subjects) && data.subjects.length > 0) {
    genre = data.subjects[0]
  }

  return {
    id: `br-${data.isbn || Date.now()}`,
    title: data.title || 'Sem Título',
    subtitle: data.subtitle || '',
    author: authors,
    publisher: data.publisher || '',
    publishedDate: data.year ? String(data.year) : '',
    description: data.synopsis || '',
    totalPages: Number(data.page_count) || 0,
    genre: genre,
    coverUrl: data.cover_url || (data.isbn ? `https://covers.openlibrary.org/b/isbn/${data.isbn}-M.jpg` : ''),
    isbn: data.isbn || '',
    source: 'BrasilAPI / CBL',
  }
}

/**
 * Formata item do Google Books
 */
function formatGoogleBook(item) {
  if (!item) return null
  const info = item.volumeInfo || {}

  let coverUrl = ''
  if (info.imageLinks) {
    coverUrl = info.imageLinks.thumbnail || info.imageLinks.smallThumbnail || ''
    if (typeof coverUrl === 'string' && coverUrl.startsWith('http://')) {
      coverUrl = coverUrl.replace('http://', 'https://')
    }
    if (typeof coverUrl === 'string') {
      coverUrl = coverUrl.replace('&edge=curl', '')
    }
  }

  let isbn = ''
  if (Array.isArray(info.industryIdentifiers) && info.industryIdentifiers.length > 0) {
    const isbn13 = info.industryIdentifiers.find(id => id && id.type === 'ISBN_13')
    const isbn10 = info.industryIdentifiers.find(id => id && id.type === 'ISBN_10')
    isbn = isbn13 ? isbn13.identifier : (isbn10 ? isbn10.identifier : info.industryIdentifiers[0]?.identifier || '')
  }

  const authors = Array.isArray(info.authors)
    ? info.authors.join(', ')
    : (info.authors || 'Autor Desconhecido')

  let genre = 'Geral'
  if (Array.isArray(info.categories) && info.categories.length > 0 && typeof info.categories[0] === 'string') {
    genre = info.categories[0].split('/')[0].trim() || 'Geral'
  }

  return {
    id: item.id || `gb-${Date.now()}`,
    title: info.title || 'Sem Título',
    subtitle: info.subtitle || '',
    author: authors,
    publisher: info.publisher || '',
    publishedDate: info.publishedDate || '',
    description: info.description || '',
    totalPages: Number(info.pageCount) || 0,
    genre: genre,
    coverUrl: coverUrl,
    isbn: isbn,
    source: 'Google Books',
  }
}

function isbn13To10(isbn13) {
  const clean = (isbn13 || '').replace(/[^0-9]/g, '')
  if (clean.length !== 13 || !clean.startsWith('978')) return clean
  const core = clean.substring(3, 12)
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(core[i]) * (10 - i)
  }
  const remainder = (11 - (sum % 11)) % 11
  const checkDigit = remainder === 10 ? 'X' : String(remainder)
  return core + checkDigit
}

/**
 * Tenta encontrar a melhor capa possível a partir de ISBN, título e autor
 */
async function resolveBestCover(isbn, title = '', author = '') {
  const cleanIsbn = (isbn || '').replace(/[^0-9X]/gi, '')
  
  // 1. Tenta Google Books por ISBN
  if (cleanIsbn) {
    try {
      const gbRes = await axios.get(GOOGLE_BOOKS_BASE_URL, {
        params: { q: `isbn:${cleanIsbn}` },
        timeout: 4000,
      })
      if (gbRes.data && Array.isArray(gbRes.data.items) && gbRes.data.items.length > 0) {
        const item = gbRes.data.items[0]
        const links = item.volumeInfo?.imageLinks
        if (links) {
          const img = links.thumbnail || links.smallThumbnail || links.medium || links.large || ''
          if (img) {
            return img.replace('http://', 'https://').replace('&edge=curl', '')
          }
        }
      }
    } catch {
      // Ignora falha na busca por ISBN no Google Books
    }
  }

  // 2. Tenta Google Books por Título + Autor
  if (title && title.trim()) {
    try {
      const q = author ? `intitle:${title}+inauthor:${author}` : title
      const gbRes = await axios.get(GOOGLE_BOOKS_BASE_URL, {
        params: { q, maxResults: 3 },
        timeout: 4000,
      })
      if (gbRes.data && Array.isArray(gbRes.data.items)) {
        for (const item of gbRes.data.items) {
          const links = item.volumeInfo?.imageLinks
          if (links) {
            const img = links.thumbnail || links.smallThumbnail || links.medium || links.large || ''
            if (img) {
              return img.replace('http://', 'https://').replace('&edge=curl', '')
            }
          }
        }
      }
    } catch {
      // Ignora falha na busca por título no Google Books
    }
  }

  // 3. Tenta Open Library por ISBN
  if (cleanIsbn) {
    return `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg?default=false`
  }

  return ''
}

export const googleBooksService = {
  /**
   * Busca livros combinando Open Library (Ilimitada) + Google Books (se disponível)
   * @param {string} query
   * @param {string} preferredSource - 'all' | 'openlibrary' | 'google'
   * @returns {Promise<Array>}
   */
  async searchBooks(query, preferredSource = 'all') {
    const trimmed = (query || '').trim()
    if (!trimmed) return []

    let results = []

    // 1. Busca no Open Library (100% gratuita, sem limite rígido)
    if (preferredSource === 'all' || preferredSource === 'openlibrary') {
      try {
        const olRes = await axios.get(OPEN_LIBRARY_SEARCH_URL, {
          params: {
            q: trimmed,
            limit: 12,
          },
          timeout: 6000,
        })

        if (olRes.data && Array.isArray(olRes.data.docs)) {
          const olBooks = olRes.data.docs
            .map(formatOpenLibraryBook)
            .filter(Boolean)
          results.push(...olBooks)
        }
      } catch (e) {
        console.warn('Falha Open Library:', e.message)
      }
    }

    // 2. Se preferir Google Books ou se Open Library trouxe poucos resultados
    if ((preferredSource === 'all' && results.length < 5) || preferredSource === 'google') {
      try {
        const gbRes = await axios.get(GOOGLE_BOOKS_BASE_URL, {
          params: {
            q: trimmed,
            maxResults: 10,
            printType: 'books',
          },
          timeout: 5000,
        })

        if (gbRes.data && Array.isArray(gbRes.data.items)) {
          const gbBooks = gbRes.data.items
            .map(formatGoogleBook)
            .filter(Boolean)
          
          // Evitar duplicados por título aproximado
          for (const gBook of gbBooks) {
            const exists = results.some(r => r.title.toLowerCase() === gBook.title.toLowerCase())
            if (!exists) {
              results.push(gBook)
            }
          }
        }
      } catch (e) {
        console.warn('Google Books falhou ou atingiu limite:', e.message)
      }
    }

    return results
  },

  /**
   * Busca livro por ISBN usando BrasilAPI (CBL) -> Open Library -> Google Books
   * com cross-referenciamento para garantir a melhor capa disponível.
   * @param {string} isbn
   */
  async searchByIsbn(isbn) {
    const cleanIsbn = (isbn || '').replace(/[^0-9X]/gi, '')
    if (!cleanIsbn) return null

    let foundBook = null

    // 1. Tentar BrasilAPI (CBL - Câmara Brasileira do Livro)
    try {
      const brRes = await axios.get(`${BRASIL_API_ISBN_URL}/${cleanIsbn}`, { timeout: 4000 })
      if (brRes.data && brRes.data.title) {
        foundBook = formatBrasilApiBook(brRes.data)
      }
    } catch (e) {
      console.warn('BrasilAPI não encontrou o ISBN:', e.message)
    }

    // 2. Tentar Open Library por ISBN
    if (!foundBook) {
      try {
        const olRes = await axios.get(OPEN_LIBRARY_SEARCH_URL, {
          params: { isbn: cleanIsbn, limit: 1 },
          timeout: 5000,
        })
        if (olRes.data && Array.isArray(olRes.data.docs) && olRes.data.docs.length > 0) {
          foundBook = formatOpenLibraryBook(olRes.data.docs[0])
        }
      } catch (e) {
        console.warn('Open Library ISBN falhou:', e.message)
      }
    }

    // 3. Fallback Google Books por ISBN
    if (!foundBook) {
      try {
        const gbRes = await axios.get(GOOGLE_BOOKS_BASE_URL, {
          params: { q: `isbn:${cleanIsbn}` },
          timeout: 5000,
        })
        if (gbRes.data && Array.isArray(gbRes.data.items) && gbRes.data.items.length > 0) {
          foundBook = formatGoogleBook(gbRes.data.items[0])
        }
      } catch (e) {
        console.warn('Google Books ISBN falhou:', e.message)
      }
    }

    // Se encontramos o livro mas ele veio sem capa (ou com capa padrão vazia), buscar a melhor capa nas outras APIs
    if (foundBook) {
      if (!foundBook.coverUrl) {
        const bestCover = await resolveBestCover(cleanIsbn, foundBook.title, foundBook.author)
        if (bestCover) {
          foundBook.coverUrl = bestCover
        }
      }
      return foundBook
    }

    return null
  },

  /**
   * Busca capas alternativas para um livro
   */
  async searchAlternativeCovers(title, author, isbn) {
    const covers = []
    const cleanIsbn = (isbn || '').replace(/[^0-9X]/gi, '')

    // 1. Open Library High-Res
    if (cleanIsbn) {
      covers.push(`https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg?default=false`)
      const isbn10 = isbn13To10(cleanIsbn)
      if (isbn10 && isbn10.length === 10) {
        covers.push(`https://images-na.ssl-images-amazon.com/images/P/${isbn10}.01.LZZZZZZZ.jpg`)
      }
    }

    // 2. Google Books by title
    try {
      const q = title ? (author ? `intitle:${title}+inauthor:${author}` : title) : `isbn:${cleanIsbn}`
      const gbRes = await axios.get(GOOGLE_BOOKS_BASE_URL, {
        params: { q, maxResults: 6 },
        timeout: 5000,
      })
      if (gbRes.data && Array.isArray(gbRes.data.items)) {
        for (const item of gbRes.data.items) {
          const links = item.volumeInfo?.imageLinks
          if (links) {
            const img = links.thumbnail || links.smallThumbnail || links.medium || links.large || ''
            if (img) {
              const formatted = img.replace('http://', 'https://').replace('&edge=curl', '')
              if (!covers.includes(formatted)) {
                covers.push(formatted)
              }
            }
          }
        }
      }
    } catch {
      // Ignora falha na busca complementar de capas
    }

    return covers
  }
}
