import { useState } from "react";
import { formatMoney } from "../utils/calculatePrice";
import { calculateDeliveryTotal } from "../utils/calculateDelivery";
import AutoDeliveryModal from "./AutoDeliveryModal";

function DeliveryRow({ title, qty, price, onQtyChange, onPriceChange }) {
  return (
    <div className="delivery-new-row">
      <div className="delivery-new-title">{title}</div>

      <button
        type="button"
        className="delivery-minus"
        onClick={() => onQtyChange(Math.max(0, Number(qty || 0) - 1))}
      >
        -
      </button>

      <input
        className="delivery-qty"
        type="number"
        value={qty}
        onChange={(e) => onQtyChange(e.target.value === "" ? "" : Number(e.target.value))}
      />

      <button
        type="button"
        className="delivery-plus"
        onClick={() => onQtyChange(Number(qty || 0) + 1)}
      >
        +
      </button>

      <input
        className="delivery-price"
        type="number"
        value={price}
        onChange={(e) => onPriceChange(e.target.value === "" ? "" : Number(e.target.value))}
      />

      <div className="delivery-currency">руб</div>
    </div>
  );
}

export default function DeliveryBlock({
  delivery,
  updateDelivery,
  cart = [],
  applyAutoDelivery,
  showToast,
}) {
  const [isAutoOpen, setIsAutoOpen] = useState(false);
  const deliveryTotal = calculateDeliveryTotal(delivery);

  return (
    <section className="card delivery-new-card">
      <h2>Доставка</h2>

      <button
        type="button"
        className="auto-delivery-open-btn"
        onClick={() => setIsAutoOpen(true)}
      >
        Автодоставка
      </button>

      <DeliveryRow
        title="Фура"
        qty={delivery.truckQty}
        price={delivery.truckPrice}
        onQtyChange={(value) => updateDelivery("truckQty", value)}
        onPriceChange={(value) => updateDelivery("truckPrice", value)}
      />

      <DeliveryRow
        title="Манипулятор 10 т"
        qty={delivery.manipulatorQty}
        price={delivery.manipulatorPrice}
        onQtyChange={(value) => updateDelivery("manipulatorQty", value)}
        onPriceChange={(value) => updateDelivery("manipulatorPrice", value)}
      />

      <DeliveryRow
        title="Манипулятор 20 т"
        qty={delivery.trailerQty}
        price={delivery.trailerPrice}
        onQtyChange={(value) => updateDelivery("trailerQty", value)}
        onPriceChange={(value) => updateDelivery("trailerPrice", value)}
      />

      <DeliveryRow
        title="Разгрузка"
        qty={delivery.unloadQty}
        price={delivery.unloadPrice}
        onQtyChange={(value) => updateDelivery("unloadQty", value)}
        onPriceChange={(value) => updateDelivery("unloadPrice", value)}
      />

      <div className="total-line delivery-total-line">
        <span>Итого доставка</span>
        <strong>{formatMoney(deliveryTotal)}</strong>
      </div>

      <AutoDeliveryModal
        isOpen={isAutoOpen}
        onClose={() => setIsAutoOpen(false)}
        cart={cart}
        applyAutoDelivery={applyAutoDelivery}
        showToast={showToast}
      />
    </section>
  );
}
