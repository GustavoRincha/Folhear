/**
 * Storage Service - Abstração da camada de persistência de dados.
 * 
 * Atualmente utiliza localStorage para desenvolvimento e ambiente web.
 * No futuro, a migração para @capacitor/preferences ou SQLite no mobile
 * exigirá alterações apenas neste serviço, mantendo intactas as stores e componentes.
 */

export const storageService = {
  /**
   * Obtém um dado do storage e o converte de JSON.
   * @param {string} key 
   * @param {*} defaultValue 
   * @returns {*}
   */
  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      if (item === null || item === undefined) {
        return defaultValue
      }
      return JSON.parse(item)
    } catch (error) {
      console.error(`[storageService] Falha ao ler "${key}":`, error)
      return defaultValue
    }
  },

  /**
   * Serializa e salva um dado no storage.
   * @param {string} key 
   * @param {*} value 
   * @returns {boolean} Sucesso da operação
   */
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`[storageService] Falha ao salvar "${key}":`, error)
      return false
    }
  },

  /**
   * Remove um item do storage.
   * @param {string} key 
   */
  removeItem(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`[storageService] Falha ao remover "${key}":`, error)
    }
  },

  /**
   * Limpa todos os dados armazenados.
   */
  clear() {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('[storageService] Falha ao limpar storage:', error)
    }
  }
}
