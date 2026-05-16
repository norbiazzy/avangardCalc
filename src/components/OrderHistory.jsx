import { formatMoney } from "../utils/calculatePrice";

export default function OrderHistory({
  orders,
  isOpen,
  onClose,
  onLoadOrder,
  onRepeatOrder,
  onDeleteOrder,
  onGeneratePdf,
  onClearHistory,
}) {
  if (!isOpen) return null;

  return (
    <div className="history-backdrop" onClick={onClose}>
      <section className="history-panel card" onClick={(event) => event.stopPropagation()}>
        <div className="history-header">
          <div>
            <h2>История заказов</h2>
            <small>{orders.length} сохраненных заказов</small>
          </div>

          <button className="history-close" onClick={onClose}>×</button>
        </div>

        {orders.length === 0 && (
          <div className="history-empty">
            История пока пустая. Сохраните первый заказ из корзины.
          </div>
        )}

        <div className="history-list">
          {orders.map((order) => (
            <article className="history-item" key={order.id}>
              <div>
                <strong>№ {order.number}</strong>
                <small>{order.date}</small>
              </div>

              <div>
                <span>{order.clientName || "Без клиента"}</span>
                <small>{order.address || "Адрес не указан"}</small>
              </div>

              <div>
                <b>{formatMoney(order.total)}</b>
                <small>{order.cart.length} поз.</small>
              </div>

              <div className="history-actions">
                <button onClick={() => onLoadOrder(order)}>Открыть</button>
                <button onClick={() => onRepeatOrder(order)}>Повторить</button>
                <button onClick={() => onGeneratePdf(order)}>PDF</button>
                <button className="danger" onClick={() => onDeleteOrder(order.id)}>Удалить</button>
              </div>
            </article>
          ))}
        </div>

        {orders.length > 0 && (
          <button className="clear-btn history-clear" onClick={onClearHistory}>
            Очистить историю
          </button>
        )}
      </section>
    </div>
  );
}
