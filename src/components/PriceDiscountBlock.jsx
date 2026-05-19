import { formatMoney } from "../utils/calculatePrice";

const QUICK_DISCOUNTS = [4, 0, -7, -10, -12];

export default function PriceDiscountBlock({
  title = "Цена и скидка",
  basePrice,
  finalPrice,
  percent,
  total,
  totalLabel,
  onBasePriceChange,
  onFinalPriceChange,
  onPercentChange,
  children,
}) {
  function changePercent(step) {
    onPercentChange(Number(percent || 0) + step);
  }

  return (
    <section className="price-discount-card">
      <h3>{title}</h3>

      <div className="inline-inputs price-line">
        <label>
          <span>₽</span>
          <input
            type="number"
            value={basePrice}
            onChange={(e) =>
              onBasePriceChange(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </label>

        <label>
          <span>Цена</span>
          <input
            type="number"
            value={finalPrice}
            onChange={(e) =>
              onFinalPriceChange(e.target.value === "" ? "" : Number(e.target.value))
            }
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
            value={percent}
            onChange={(e) =>
              onPercentChange(e.target.value === "" ? "" : Number(e.target.value))
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
            className={Number(percent) === value ? "quick-discount active" : "quick-discount"}
            onClick={() => onPercentChange(value)}
          >
            {value > 0 ? `+${value}%` : `${value}%`}
          </button>
        ))}
      </div>

      <div className="total-line">
        <span>{totalLabel}</span>
        <strong>{formatMoney(total)}</strong>
      </div>

      {children}
    </section>
  );
}
