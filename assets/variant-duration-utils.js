/**
 * VariantDurationUtils - Utilitaires pour le calcul et formatage des prix par jour
 * pour les variantes de durée de produits
 */
window.VariantDurationUtils = {
  /**
   * Calcule le prix par jour à partir d'un prix total et d'un nombre de jours
   * @param {number} priceInCents - Prix en centimes
   * @param {number} days - Nombre de jours
   * @param {string} currencySymbol - Symbole de la devise (ex: "€", "$")
   * @param {string} locale - Code locale (ex: "fr-FR", "en-US")
   * @returns {string} Prix formaté par jour
   */
  calculatePricePerDay(priceInCents, days, currencySymbol, locale) {
    // Validation stricte - évite NaN, Infinity, et valeurs invalides
    if (typeof priceInCents !== 'number' || isNaN(priceInCents) || priceInCents < 0) {
      return '0' + (currencySymbol || '€');
    }
    
    if (typeof days !== 'number' || isNaN(days) || days <= 0) {
      return '0' + (currencySymbol || '€');
    }

    const pricePerDay = priceInCents / 100 / days;
    
    // Vérifier que le résultat est valide
    if (!isFinite(pricePerDay) || pricePerDay < 0) {
      return '0' + (currencySymbol || '€');
    }
    
    try {
      // Utiliser toLocaleString pour le formatage internationalisé
      // Cela gère automatiquement les séparateurs décimaux selon la locale
      const formatted = pricePerDay.toLocaleString(locale || 'fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      
      return formatted + ' ' + (currencySymbol || '€');
    } catch (e) {
      // Fallback simple en cas d'erreur
      const formatted = pricePerDay.toFixed(2);
      // Adapter le séparateur décimal selon la locale (fr-FR utilise ',')
      const separator = (locale || 'fr-FR').startsWith('fr') ? ',' : '.';
      return formatted.replace('.', separator) + ' ' + (currencySymbol || '€');
    }
  }
};

/**
 * Alpine.js data function pour les labels de durée de variant
 * Cette fonction est appelée par Alpine.js pour initialiser chaque label
 */
function variantDurationLabel(config) {
  return {
    price: config.price || 0,
    days: config.days || 0,
    prefix: config.prefix || '',
    suffix: config.suffix || '',
    currencySymbol: config.currencySymbol || window.Shopify?.currency?.symbol || '€',
    locale: config.locale || 'fr-FR',

    /**
     * Getter pour calculer le prix par jour formaté
     * Calculé automatiquement par Alpine.js au chargement
     */
    get pricePerDay() {
      // Validation stricte avant calcul
      if (typeof this.price !== 'number' || isNaN(this.price) || this.price < 0) {
        return '0' + this.currencySymbol;
      }
      
      if (typeof this.days !== 'number' || isNaN(this.days) || this.days <= 0) {
        return '0' + this.currencySymbol;
      }

      if (!window.VariantDurationUtils) {
        // Fallback si le module n'est pas chargé
        const pricePerDay = (this.price / 100 / this.days).toFixed(2);
        // Vérifier que le résultat est valide
        if (!isFinite(parseFloat(pricePerDay))) {
          return '0' + this.currencySymbol;
        }
        const separator = this.locale.startsWith('fr') ? ',' : '.';
        return pricePerDay.replace('.', separator) + ' ' + this.currencySymbol;
      }

      return window.VariantDurationUtils.calculatePricePerDay(
        this.price,
        this.days,
        this.currencySymbol,
        this.locale
      );
    },

    /**
     * Getter pour le texte complet du prix par jour
     * Calculé automatiquement par Alpine.js au chargement
     */
    get pricePerDayText() {
      const pricePerDay = this.pricePerDay;
      const parts = [this.prefix, pricePerDay, this.suffix]
        .filter(part => part && part.trim())
        .join(' ');
      
      return parts || pricePerDay;
    }
  };
}

// Exposer la fonction pour Alpine.js
// Disponible immédiatement, même si Alpine.js se charge après
window.variantDurationLabel = variantDurationLabel;
