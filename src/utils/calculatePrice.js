export function calculateFinalPrice(pricePerM3, percent) {
  return Math.round(Number(pricePerM3 || 0) + (Number(pricePerM3 || 0) * Number(percent || 0)) / 100);
}

export function calculateProductTotal(m3, pricePerM3) {
  return Math.round(Number(m3 || 0) * Number(pricePerM3 || 0));
}

export function formatMoney(value) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(Number(value || 0))) + " ₽";
}
