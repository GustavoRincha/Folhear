import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/**
 * Gera links de busca direta caso a API esteja offline
 */
function getFallbackStoreLinks(isbn, title, author) {
  const query = isbn || `${title || ''} ${author || ''}`.trim()
  const encQuery = encodeURIComponent(query)

  return [
    {
      store: 'Estante Virtual',
      storeIcon: 'menu_book',
      price: null,
      priceFormatted: 'Consultar no site',
      condition: 'Novos e Usados',
      title: title || 'Estante Virtual',
      url: `https://www.estantevirtual.com.br/busca?q=${encQuery}`,
      available: false,
      note: 'Clique para buscar na loja'
    },
    {
      store: 'Amazon Brasil',
      storeIcon: 'shopping_bag',
      price: null,
      priceFormatted: 'Consultar no site',
      condition: 'Novo / Kindle',
      title: title || 'Amazon Brasil',
      url: `https://www.amazon.com.br/s?k=${encQuery}&i=stripbooks`,
      available: false,
      note: 'Clique para buscar na loja'
    },
    {
      store: 'Mercado Livre',
      storeIcon: 'local_shipping',
      price: null,
      priceFormatted: 'Consultar no site',
      condition: 'Novo ou Usado',
      title: title || 'Mercado Livre',
      url: `https://lista.mercadolivre.com.br/${encodeURIComponent('livro ' + query)}`,
      available: false,
      note: 'Clique para buscar na loja'
    },
    {
      store: 'Google Shopping',
      storeIcon: 'search',
      price: null,
      priceFormatted: 'Comparar no Google',
      condition: 'Múltiplas lojas',
      title: title || 'Google Shopping',
      url: `https://www.google.com/search?tbm=shop&q=${encodeURIComponent('livro ' + query)}`,
      available: false,
      note: 'Pesquisa agregada do Google'
    }
  ]
}

export const priceCrawlerService = {
  /**
   * Consulta os preços do livro chamando a APIFolhear
   * @param {Object} book - { isbn, title, author }
   */
  async getBookPrices({ isbn, title, author }) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/prices`, {
        params: {
          isbn: (isbn || '').replace(/[^0-9X]/gi, ''),
          title: title || '',
          author: author || ''
        },
        timeout: 10000
      })

      if (response.data && Array.isArray(response.data.results)) {
        return {
          ...response.data,
          isOnline: true
        }
      }
      throw new Error('Resposta sem resultados válidos')
    } catch (error) {
      console.warn('APIFolhear offline ou com erro. Usando links diretos de contingência:', error.message)
      const fallbackLinks = getFallbackStoreLinks(isbn, title, author)
      return {
        query: { isbn, title, author },
        totalSources: fallbackLinks.length,
        lowestPrice: null,
        lowestPriceFormatted: null,
        bestDealStore: null,
        results: fallbackLinks,
        isOnline: false,
        error: error.message
      }
    }
  }
}
