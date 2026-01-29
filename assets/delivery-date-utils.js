window.DeliveryDateUtils = {
  calculateDeliveryDate(days) {
    if (!days || isNaN(days)) return '';
    const date = new Date();
    date.setDate(date.getDate() + parseInt(days));
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  }
};
