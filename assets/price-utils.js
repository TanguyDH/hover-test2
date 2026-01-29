window.PriceUtils = {
  /**
   * Formate un prix formaté (ex: "35,00 €") en format simple sans décimales (ex: "35€")
   * @param {string} priceText - Le texte du prix formaté
   * @returns {string} - Le prix formaté sans décimales avec le symbole €
   */
  formatPriceSimple(priceText) {
    if (!priceText) return '';
    let numberStr = priceText.replace(/[^\d,.]/g, '');
    numberStr = numberStr.replace(',', '.');
    const parts = numberStr.split('.');
    const amount = parseInt(parts[0]);
    return amount + '€';
  },

  /**
   * Extrait le prix depuis un élément DOM
   * @param {string} containerId - L'ID du conteneur du prix
   * @returns {string} - Le texte du prix ou une chaîne vide
   */
  getPriceFromContainer(containerId) {
    const priceEl = document.querySelector(
      `${containerId} .price-item--last, ${containerId} .price-item--regular`
    );
    return priceEl?.textContent.trim() || '';
  },

  /**
   * Crée un observer qui met à jour automatiquement un élément avec le prix formaté
   * @param {string} containerId - L'ID du conteneur du prix (ex: '#price-123')
   * @param {HTMLElement} targetElement - L'élément à mettre à jour
   * @param {string} prefix - Préfixe à ajouter avant le prix (ex: ' | ')
   * @returns {MutationObserver|null} - L'observer créé (pour pouvoir le disconnect si besoin)
   */
  observePriceAndUpdate(containerId, targetElement, prefix = ' | ') {
    const update = () => {
      const priceText = this.getPriceFromContainer(containerId);
      if (priceText) {
        const formatted = this.formatPriceSimple(priceText);
        targetElement.textContent = prefix + formatted;
      }
    };

    // Mise à jour initiale
    update();

    // Observer les changements
    const container = document.querySelector(containerId);
    if (container) {
      const observer = new MutationObserver(update);
      observer.observe(container, {
        childList: true,
        subtree: true,
        characterData: true
      });
      return observer;
    }
    return null;
  }
};
