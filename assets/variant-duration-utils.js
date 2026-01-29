/**
 * Utilitaires pour le calcul et formatage des prix par jour pour les variants de durée
 */
window.VariantDurationUtils = {
  /**
   * Calcule le prix par jour à partir d'un prix et d'un nombre de jours
   * @param {number} priceInCents - Prix en centimes
   * @param {number} days - Nombre de jours
   * @param {string} currencySymbol - Symbole de devise
   * @param {string} locale - Locale pour le formatage (ex: 'fr-FR', 'en-US')
   * @returns {string} Prix formaté par jour
   */
  calculatePricePerDay(priceInCents, days, currencySymbol, locale = 'fr-FR') {
    if (!days || days === 0) return '';
    
    const pricePerDay = priceInCents / 100 / days;
    
    // Mapper les symboles de devise vers les codes ISO
    const currencyMap = {
      '€': 'EUR',
      '$': 'USD',
      '£': 'GBP',
      '¥': 'JPY',
      'CHF': 'CHF',
      'CAD': 'CAD',
      'AUD': 'AUD'
    };
    
    const currencyCode = currencyMap[currencySymbol] || 'EUR';
    
    // Utiliser Intl.NumberFormat pour l'internationalisation
    try {
      const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      
      return formatter.format(pricePerDay);
    } catch (e) {
      // Fallback si la locale n'est pas supportée
      const pricePerDayFormatted = pricePerDay.toFixed(2).replace('.', ',');
      return pricePerDayFormatted + ' ' + currencySymbol;
    }
  },

  /**
   * Extrait le nombre de mois depuis une valeur de variant
   * @param {string} value - Valeur du variant (ex: "3 mois", "12 mois", "1M")
   * @returns {number} Nombre de mois
   */
  extractMonths(value) {
    if (!value) return 0;
    
    // Regex pour extraire le premier nombre
    const match = value.toString().match(/^(\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }
    
    return 0;
  },

  /**
   * Convertit les mois en jours (approximation: 30 jours par mois)
   * @param {number} months - Nombre de mois
   * @returns {number} Nombre de jours
   */
  monthsToDays(months) {
    return months * 30;
  }
};
