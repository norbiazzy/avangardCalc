import { useEffect, useMemo, useState } from "react";
import { LINTELS, isReinforcedLintel } from "../data/lintels";
import { formatMoney } from "../utils/calculatePrice";
import SegmentedButtons from "./SegmentedButtons";
import {
  U_BLOCK_DEFAULT_PRICE_PER_M3,
  U_BLOCK_OPTIONS,
  getUBlockPiecePrice,
  getUBlockVolumeM3,
  makeUBlockTitle,
} from "../data/uBlocks";

const CATEGORIES = ["Все", "1500", "2000", "2500", "3000"];
const QUICK_PERCENT = [4, 0, -7, -10, -12];

function applyAdjustments(price, percent, rub) {
  const withPercent = Number(price || 0) + (Number(price || 0) * Number(percent || 0)) / 100;
  return Math.round((withPercent + Number(rub || 0)) * 100) / 100;
}

export default function LintelModal({
  isOpen,
  onClose,
  onAddLintel,
  onAddUBlock,
  showToast,
}) {
  const [section, setSection] = useState("Перемычки");

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [selectedId, setSelectedId] = useState(LINTELS[0].id);
  const [qty, setQty] = useState(1);
  const [percent, setPercent] = useState(0);
  const [rub, setRub] = useState(0);

  const [uDensity, setUDensity] = useState("D500");
  const [uLength, setULength] = useState(500);
  const [uWidth, setUWidth] = useState(400);
  const [uHeight, setUHeight] = useState(250);
  const [uQty, setUQty] = useState(6);
  const [uPricePerM3, setUPricePerM3] = useState(U_BLOCK_DEFAULT_PRICE_PER_M3);

  useEffect(() => {
    if (!isOpen) return;

    document.body.classList.add("modal-open");

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

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

  const uVolumeM3 = getUBlockVolumeM3({
    length: uLength,
    width: uWidth,
    height: uHeight,
  });
  const uPiecePrice = getUBlockPiecePrice({
    length: uLength,
    width: uWidth,
    height: uHeight,
    pricePerM3: uPricePerM3,
  });
  const uTotal = Number(uQty || 0) * uPiecePrice;
  const uTitle = makeUBlockTitle({
    density: uDensity,
    length: uLength,
    width: uWidth,
    height: uHeight,
  });

  if (!isOpen) return null;

  function addSelectedLintel() {
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

  function addSelectedUBlock() {
    if (!uQty || Number(uQty) <= 0) {
      showToast("Укажите количество U-блоков", "error");
      return;
    }

    onAddUBlock({
      id: Date.now(),
      type: "ublock",
      title: uTitle,
      density: uDensity,
      length: uLength,
      width: uWidth,
      height: uHeight,
      qty: Number(uQty),
      volumeM3: uVolumeM3,
      pricePerM3: Number(uPricePerM3 || 0),
      finalPrice: uPiecePrice,
      total: uTotal,
    });

    onClose();
  }

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-handle" />

        <div className="drawer-head">
          <div>
            <h2>Дополнительно</h2>
            <small>Перемычки и U-блоки</small>
          </div>

          <button className="drawer-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-section-tabs">
          <button
            className={section === "Перемычки" ? "active" : ""}
            onClick={() => setSection("Перемычки")}
          >
            Перемычки
          </button>

          <button
            className={section === "U-блоки" ? "active" : ""}
            onClick={() => setSection("U-блоки")}
          >
            U-блоки
          </button>
        </div>

        {section === "Перемычки" ? (
          <>
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
                <input type="number" value={qty} onChange={(e) => setQty(e.target.value === "" ? "" : Number(e.target.value))} />
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

            <button className="lintel-add-main" onClick={addSelectedLintel}>
              Добавить в заказ
            </button>
          </>
        ) : (
          <>
            <div className="ublock-section">
              <div className="section-mini-title">Плотность</div>
              <SegmentedButtons
                options={U_BLOCK_OPTIONS.densities}
                value={uDensity}
                onChange={setUDensity}
              />
            </div>

            <div className="ublock-section">
              <div className="section-mini-title">Длина</div>
              <SegmentedButtons
                options={U_BLOCK_OPTIONS.lengths}
                value={uLength}
                onChange={setULength}
              />
            </div>

            <div className="ublock-section">
              <div className="section-mini-title">Толщина</div>
              <div className="width-grid ublock-width-grid">
                {U_BLOCK_OPTIONS.widths.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={Number(uWidth) === Number(item) ? "width-btn active" : "width-btn"}
                    onClick={() => setUWidth(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="ublock-section">
              <div className="section-mini-title">Высота</div>
              <SegmentedButtons
                options={U_BLOCK_OPTIONS.heights}
                value={uHeight}
                onChange={setUHeight}
              />
            </div>

            <div className="ublock-input-grid">
              <label>
                Кол-во, шт
                <input
                  type="number"
                  value={uQty}
                  onChange={(e) => setUQty(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </label>

              <label>
                Цена за м³
                <input
                  type="number"
                  value={uPricePerM3}
                  onChange={(e) => setUPricePerM3(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </label>

              <label>
                Цена за шт
                <input type="number" value={uPiecePrice} readOnly />
              </label>
            </div>

            <div className="lintel-result ublock-result">
              <span>{uTitle}</span>
              <strong>
                {uQty || 0} шт * {formatMoney(uPiecePrice)} - {formatMoney(uTotal)}
              </strong>
            </div>

            <button className="lintel-add-main" onClick={addSelectedUBlock}>
              Добавить U-блок
            </button>
          </>
        )}
      </div>
    </div>
  );
}
