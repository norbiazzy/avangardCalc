import { formatMoney } from "../utils/calculatePrice";

const QUICK_DISCOUNTS = [4, 0, -7, -10, -12];

export default function PriceBlock({
  product,
  updateProductParam,
  finalPrice,
  productTotal,
  addBlockToCart,
  isEditing,
  cancelEdit,
}) {
  function changePercent(step) {
    updateProductParam("percent", Number(product.percent || 0) + step);
  }

  function updateFinalPrice(value) {
    if (value === "") {
      updateProductParam("percent", "");
      return;
    }

    const basePrice = Number(product.pricePerM3 || 0);
    const nextFinalPrice = Number(value || 0);

    if (!basePrice) {
      updateProductParam("pricePerM3", nextFinalPrice);
      updateProductParam("percent", 0);
      return;
    }

    const nextPercent = +(((nextFinalPrice - basePrice) / basePrice) * 100).toFixed(2);
    updateProductParam("percent", nextPercent);
  }

  return (
    <section className="card small-card">
      <div className="inline-inputs price-line">
        <label>
          <span>₽</span>
          <input
            type="number"
            value={product.pricePerM3}
            onChange={(e) =>
              updateProductParam("pricePerM3", e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </label>

        <label>
          <span>Цена</span>
          <input
            type="number"
            value={finalPrice}
            onChange={(e) => updateFinalPrice(e.target.value)}
          />
        </label>

        <div className="percent-control manual-percent-control">
          <button
            type="button"
            className="percent-btn plus"
            onClick={() => changePercent(1)}
          >
            +
          </button>

          <input
            className="percent-input"
            type="number"
            value={product.percent}
            onChange={(e) =>
              updateProductParam("percent", e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="%"
          />

          <button
            type="button"
            className="percent-btn minus"
            onClick={() => changePercent(-1)}
          >
            −
          </button>
        </div>
      </div>

      <div className="quick-discounts">
        {QUICK_DISCOUNTS.map((value) => (
          <button
            key={value}
            type="button"
            className={
              Number(product.percent) === value
                ? "quick-discount active"
                : "quick-discount"
            }
            onClick={() => updateProductParam("percent", value)}
          >
            {value > 0 ? `+${value}%` : `${value}%`}
          </button>
        ))}
      </div>

      <div className="total-line">
        <span>Сумма блоков</span>
        <strong>{formatMoney(productTotal)}</strong>
      </div>

      {isEditing ? (
        <div className="edit-buttons">
          <button className="add-main" onClick={addBlockToCart}>
            Сохранить изменения
          </button>
          <button className="cancel-edit-btn" onClick={cancelEdit}>
            Отменить изменения
          </button>
        </div>
      ) : (
        <button className="add-main" onClick={addBlockToCart}>
          Добавить блоки
        </button>
      )}
    </section>
  );
}
