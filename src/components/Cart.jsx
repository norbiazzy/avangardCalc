import { formatMoney } from "../utils/calculatePrice";

export default function Cart({
  cart,
  total,
  deliveryItems,
  deliveryTotal,
  removeFromCart,
  clearCart,
  copyCart,
  startEditCartItem,
}) {
  const goodsTotal = cart.reduce((sum, item) => sum + Number(item.total || 0), 0);

  const piecesTotal = cart.reduce((sum, item) => {
    if (item.type === "block") return sum + Number(item.pieces || 0);
    if (item.type === "ceramic") return sum + Number(item.qty || item.pieces || 0);
    if (item.type === "lintel") return sum + Number(item.qty || 0);
    if (item.type === "glue" || item.type === "foam") return sum + Number(item.qty || 0);
    return sum;
  }, 0);

  return (
    <section className="card cart-card">
      <h2>Заказ</h2>

      {cart.length === 0 && deliveryItems.length === 0 && (
        <p className="empty">Пока ничего не добавлено</p>
      )}

      <div className="cart-list">
        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <div>
              <strong>{item.title}</strong>
              {item.type === "ublock" ? (
                <small>
                  {item.qty} шт * {formatMoney(item.finalPrice)}
                </small>
              ) : item.type === "ceramic" ? (
                <small>
                  {item.shortTitle} · {item.qty} шт · {item.m3} м³ · {item.pallets} под. · {formatMoney(item.finalPrice)}
                </small>
              ) : item.type === "lintel" ? (
                <small>
                  {item.shortTitle} · {item.qty} шт × {formatMoney(item.finalPrice)}
                </small>
              ) : (
                item.description && <small>{item.description}</small>
              )}
              <b>{formatMoney(item.total)}</b>
            </div>

            <div className="cart-actions">
              {item.type === "block" && (
                <button
                  className="edit-btn"
                  onClick={() => startEditCartItem(item.id)}
                >
                  Ред.
                </button>
              )}

              <button onClick={() => removeFromCart(item.id)}>×</button>
            </div>
          </div>
        ))}

        {deliveryItems.map((item) => (
          <div className="cart-item delivery-cart-item" key={item.key}>
            <div>
              <strong>{item.title}</strong>
              <small>{item.qty} шт × {formatMoney(item.price)}</small>
              <b>{formatMoney(item.total)}</b>
            </div>
          </div>
        ))}
      </div>

      <div className="total-line final">
        <span>Доставка</span>
        <strong>{formatMoney(deliveryTotal)}</strong>
      </div>

      <div className="total-line final">
        <span>Итого</span>
        <strong>{formatMoney(total)}</strong>
      </div>

      <button className="copy-btn" onClick={() => copyCart("full")}>Копировать полный</button>
      <button className="copy-btn minimal-copy" onClick={() => copyCart("minimal")}>Копировать минимум</button>

      <div className="copy-summary">
        <span>Штук в заказе</span>
        <strong>{piecesTotal}</strong>
      </div>

      <div className="copy-summary">
        <span>Стоимость товаров</span>
        <strong>{formatMoney(goodsTotal)}</strong>
      </div>

      <button className="clear-btn" onClick={clearCart}>Очистить</button>
    </section>
  );
}
