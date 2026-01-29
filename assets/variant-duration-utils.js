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
    if (!priceInCents || !days || days <= 0) {
      return '0' + currencySymbol;
    }

    const pricePerDay = priceInCents / 100 / days;
    
    try {
      // Utiliser toLocaleString pour le formatage internationalisé
      // Cela gère automatiquement les séparateurs décimaux selon la locale
      const formatted = pricePerDay.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      
      return formatted + ' ' + currencySymbol;
    } catch (e) {
      // Fallback simple en cas d'erreur
      const formatted = pricePerDay.toFixed(2);
      // Adapter le séparateur décimal selon la locale (fr-FR utilise ',')
      const separator = locale.startsWith('fr') ? ',' : '.';
      return formatted.replace('.', separator) + ' ' + currencySymbol;
    }
  },

  /**
   * Extrait le nombre de mois depuis une valeur de variant
   * Supporte plusieurs formats : "1 mois", "3 mois", "12 mois", "1M", "3M", etc.
   * @param {string} value - Valeur du variant (ex: "1 mois", "3M")
   * @returns {number} Nombre de mois extrait, ou 0 si non trouvé
   */
  extractMonthsFromValue(value) {
    if (!value || typeof value !== 'string') {
      return 0;
    }

    const normalized = value.trim().toLowerCase();
    
    // Patterns de recherche pour différents formats
    const patterns = [
      /^(\d+)\s*mois/i,           // "1 mois", "3 mois"
      /^(\d+)\s*m\b/i,             // "1m", "3M", "12 m"
      /^(\d+)\s*month/i,            // "1 month", "3 months"
      /^(\d+)\s*mo\b/i,             // "1mo", "3MO"
      /^(\d+)/,                     // "1", "3", "12" (fallback)
    ];

    for (const pattern of patterns) {
      const match = normalized.match(pattern);
      if (match && match[1]) {
        const months = parseInt(match[1], 10);
        if (months > 0 && months <= 120) { // Validation raisonnable (max 10 ans)
          return months;
        }
      }
    }

    return 0;
  },

  /**
   * Calcule le nombre de jours à partir du nombre de mois
   * @param {number} months - Nombre de mois
   * @returns {number} Nombre de jours (30 jours par mois)
   */
  calculateDaysFromMonths(months) {
    return months * 30;
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
      if (!this.days || this.days <= 0 || !this.price) {
        return '0' + this.currencySymbol;
      }

      if (!window.VariantDurationUtils) {
        // Fallback si le module n'est pas chargé
        const pricePerDay = (this.price / 100 / this.days).toFixed(2);
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
