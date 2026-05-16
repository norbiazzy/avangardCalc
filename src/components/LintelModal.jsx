import { useMemo, useState } from "react";
import { LINTELS, isReinforcedLintel } from "../data/lintels";
import { formatMoney } from "../utils/calculatePrice";

const CATEGORIES = ["Все", "1500", "2000", "2500", "3000"];
const QUICK_PERCENT = [4, 0, -7, -10, -12];

function applyAdjustments(price, percent, rub) {
  const withPercent = Number(price || 0) + (Number(price || 0) * Number(percent || 0)) / 100;
  return Math.round((withPercent + Number(rub || 0)) * 100) / 100;
}

export default function LintelModal({ isOpen, onClose, onAddLintel, showToast }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [selectedId, setSelectedId] = useState(LINTELS[0].id);
  const [qty, setQty] = useState(1);
  const [percent, setPercent] = useState(0);
  const [rub, setRub] = useState(0);

  const filtered = useMemo(() => {
    const clean = query.trim().toLowerCase();

    return LINTELS.filter((item) => {
      const categoryOk = category === "Все" || item.category === category;
      const searchOk =
        !clean ||
        item.shortTitle.toLowerCase().includes(clean) ||
        item.fullTitle.toLowerCase().includes(clean);

      return categoryOk && searchOk;
    });
  }, [query, category]);

  const selected = LINTELS.find((item) => item.id === selectedId) || LINTELS[0];
  const finalPrice = applyAdjustments(selected.price, percent, rub);
  const total = finalPrice * Number(qty || 0);

  if (!isOpen) return null;

  function addSelected() {
    if (!qty || qty <= 0) {
      showToast("Укажите количество", "error");
      return;
    }

    onAddLintel({
      id: Date.now(),
      type: "lintel",
      title: selected.fullTitle,
      shortTitle: selected.shortTitle,
      qty: Number(qty),
      price: selected.price,
      percent: Number(percent || 0),
      rub: Number(rub || 0),
      finalPrice,
      total,
      isReinforced: isReinforcedLintel(selected),
    });

    onClose();
  }

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-handle" />

        <div className="drawer-head">
          <div>
            <h2>Перемычки</h2>
            <small>Poritep D600 B3,5 ТУ</small>
          </div>

          <button className="drawer-close" onClick={onClose}>×</button>
        </div>

        <input
          className="lintel-search"
          placeholder="Поиск: 2000*200 или 1500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="lintel-cats">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="lintel-list">
          {filtered.map((item) => {
            const active = selectedId === item.id;
            const reinforced = isReinforcedLintel(item);

            return (
              <button
                key={item.id}
                className={[
                  "lintel-item",
                  active ? "active" : "",
                  reinforced ? "reinforced" : "",
                ].join(" ")}
                onClick={() => setSelectedId(item.id)}
              >
                <span>{item.shortTitle}</span>
                {reinforced && <em>усил.</em>}
                <strong>{formatMoney(item.price)}</strong>
              </button>
            );
          })}
        </div>

        <div className="lintel-controls">
          <div className="qty-box">
            <button onClick={() => setQty(Math.max(0, Number(qty || 0) - 1))}>−</button>
            <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
            <button onClick={() => setQty(Number(qty || 0) + 1)}>+</button>
          </div>

          <div className="quick-add">
            {[1, 5, 10].map((value) => (
              <button key={value} onClick={() => setQty(Number(qty || 0) + value)}>
                +{value}
              </button>
            ))}
          </div>
        </div>

        <div className="lintel-discounts">
          <div className="discount-row">
            <button onClick={() => setPercent(Number(percent || 0) + 1)}>+</button>
            <strong>{percent}%</strong>
            <button onClick={() => setPercent(Number(percent || 0) - 1)}>−</button>
          </div>

          <div className="quick-percent">
            {QUICK_PERCENT.map((value) => (
              <button
                key={value}
                className={Number(percent) === value ? "active" : ""}
                onClick={() => setPercent(value)}
              >
                {value > 0 ? `+${value}%` : `${value}%`}
              </button>
            ))}
          </div>

          <div className="discount-row rub-row">
            <button onClick={() => setRub(Number(rub || 0) - 100)}>−100 ₽</button>
            <strong>{rub} ₽</strong>
            <button onClick={() => setRub(Number(rub || 0) + 100)}>+100 ₽</button>
          </div>
        </div>

        <div className="lintel-result">
          <span>{selected.shortTitle}</span>
          <strong>{qty} шт × {formatMoney(finalPrice)} = {formatMoney(total)}</strong>
        </div>

        <button className="lintel-add-main" onClick={addSelected}>
          Добавить в заказ
        </button>
      </div>
    </div>
  );
}
