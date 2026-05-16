const ORDER_HISTORY_KEY = "building-calculator-order-history";

export function getOrderHistory() {
  try {
    return JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveOrderToHistory(order) {
  const history = getOrderHistory();
  const nextHistory = [order, ...history].slice(0, 100);

  localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(nextHistory));

  return nextHistory;
}

export function deleteOrderFromHistory(orderId) {
  const history = getOrderHistory().filter((order) => order.id !== orderId);

  localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(history));

  return history;
}

export function clearOrderHistory() {
  localStorage.removeItem(ORDER_HISTORY_KEY);
  return [];
}
