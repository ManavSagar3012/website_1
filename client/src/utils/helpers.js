export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

export const truncate = (str, len = 60) =>
  str.length > len ? str.substring(0, len) + '…' : str;

export const getDiscountPercent = (original, sale) =>
  Math.round(((original - sale) / original) * 100);

export const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
