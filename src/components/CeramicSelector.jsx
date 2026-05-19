import { useEffect, useMemo, useState } from "react";
import SegmentedButtons from "./SegmentedButtons";
import PriceDiscountBlock from "./PriceDiscountBlock";
import {
  getCeramicManufacturers,
  getCeramicProducts,
  getCeramicWidths,
} from "../data/ceramic";
import { formatMoney } from "../utils/calculatePrice";
import {
  calculateCeramicByM3,
  calculateCeramicByPieces,
  calculateCeramicByPallets,
  calculateCeramicFinalPrice,
  calculateCeramicTotal,
} from "../utils/calculateCeramic";

const QUICK_DISCOUNTS = [4, 0, -7, -10, -12];

export default function CeramicSelector({ onAddCeramic, showToast }) {
  const manufacturers = getCeramicManufacturers();

  const [manufacturerKey, setManufacturerKey] = useState("porotherm");
  const [width, setWidth] = useState(380);
  const [warmFilter, setWarmFilter] = useState("Все");
  const [selectedId, setSelectedId] = useState("porotherm-38");

  const [quantity, setQuantity] = useState({
    m3: 0,
    pieces: 0,
    pallets: 0,
  });

  const [price, setPrice] = useState(0);
  const [percent, setPercent] = useState(-7);

  const widths = getCeramicWidths(manufacturerKey);

  const products = useMemo(() => {
    return getCeramicProducts(manufacturerKey).filter((item) => {
      const widthOk = item.width === width;
      const warmOk =
        warmFilter === "Все" ||
        (warmFilter === "Утепленный" && item.warm) ||
        (warmFilter === "Обычный" && !item.warm);

      return widthOk && warmOk;
    });
  }, [manufacturerKey, width, warmFilter]);

  const selected = products.find((item) => item.id === selectedId) || products[0];

  useEffect(() => {
    if (!selected) return;

    setPrice(selected.price);

    setQuantity((prev) => {
      if (!prev.pieces && !prev.m3 && !prev.pallets) {
        return {
          m3: 0,
          pieces: 0,
          pallets: 0,
        };
      }

      return calculateCeramicByPieces(prev.pieces, selected);
    });
  }, [selected?.id]);

  useEffect(() => {
    if (products.length && !products.some((item) => item.id === selectedId)) {
      setSelectedId(products[0].id);
    }
  }, [products, selectedId]);

  const finalPrice = calculateCeramicFinalPrice(price, percent);
  const total = calculateCeramicTotal(quantity.pieces, finalPrice);

  function updateByPieces(value) {
    if (!selected) return;
    setQuantity(calculateCeramicByPieces(value, selected));
  }

  function updateByM3(value) {
    if (!selected) return;
    setQuantity(calculateCeramicByM3(value, selected));
  }

  function updateByPallets(value) {
    if (!selected) return;
    setQuantity(calculateCeramicByPallets(value, selected));
  }

  function changePercent(step) {
    setPercent(Number(percent || 0) + step);
  }

  function updateFinalPrice(value) {
    if (value === "") {
      setPercent("");
      return;
    }

    const basePrice = Number(price || 0);
    const nextFinalPrice = Number(value || 0);

    if (!basePrice) {
      setPrice(nextFinalPrice);
      setPercent(0);
      return;
    }

    setPercent(+(((nextFinalPrice - basePrice) / basePrice) * 100).toFixed(2));
  }

  function addCeramic() {
    if (!selected) {
      showToast("Выберите керамический блок", "error");
      return;
    }

    if (!quantity.pieces || quantity.pieces <= 0) {
      showToast("Укажите количество керамики", "error");
      return;
    }

    onAddCeramic({
      id: Date.now(),
      type: "ceramic",
      title: selected.title,
      shortTitle: selected.shortTitle,
      manufacturer: selected.manufacturer,
      width: selected.width,
      size: selected.size,
      format: selected.format,
      mark: selected.mark,
      warm: selected.warm,
      m3: quantity.m3,
      qty: quantity.pieces,
      pieces: quantity.pieces,
      pallets: quantity.pallets,
      pcsPerPallet: selected.pcsPerPallet,
      pcsPerM3: selected.pcsPerM3,
      price,
      percent,
      finalPrice,
      total,
    });
  }

  return (
    <section className="card ceramic-card">
      <h1>Керамика</h1>

      <SegmentedButtons
        options={manufacturers.map((item) => item.name)}
        value={manufacturers.find((item) => item.key === manufacturerKey)?.name}
        onChange={(name) => {
          const manufacturer = manufacturers.find((item) => item.name === name);

          if (!manufacturer.ready) {
            showToast("Этого производителя заполним позже", "error");
            return;
          }

          setManufacturerKey(manufacturer.key);
          setWidth(getCeramicWidths(manufacturer.key)[0]);
        }}
      />

      <SegmentedButtons
        options={widths}
        value={width}
        onChange={(value) => setWidth(value)}
      />

      <SegmentedButtons
        options={["Все", "Обычный", "Утепленный"]}
        value={warmFilter}
        onChange={setWarmFilter}
      />

      <div className="ceramic-grid">
        {products.map((item) => (
          <button
            key={item.id}
            className={selected?.id === item.id ? "ceramic-item active" : "ceramic-item"}
            onClick={() => setSelectedId(item.id)}
          >
            <strong>{item.shortTitle}</strong>
            <small>{item.size} · {item.format} · {item.pcsPerPallet} шт/под</small>
            {item.warm && <em>утепленный</em>}
            <b>{formatMoney(item.price)}</b>
          </button>
        ))}
      </div>

      {selected && (
        <div className="ceramic-info-line">
          <span>{selected.size}</span>
          <span>{selected.pcsPerM3} шт/м³</span>
          <span>{selected.pcsPerPallet} шт/под</span>
        </div>
      )}

      <section className="ceramic-sub-card">
        <h3>Количество</h3>

        <div className="inline-inputs three">
          <label>
            <span>м3</span>
            <input
              type="number"
              value={quantity.m3}
              onChange={(e) => updateByM3(e.target.value)}
            />
          </label>

          <label>
            <span>шт.</span>
            <input
              type="number"
              value={quantity.pieces}
              onChange={(e) => updateByPieces(e.target.value)}
            />
          </label>

          <label>
            <span>пал</span>
            <input
              type="number"
              value={quantity.pallets}
              onChange={(e) => updateByPallets(e.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="ceramic-sub-card">
        <PriceDiscountBlock
          basePrice={price}
          finalPrice={finalPrice}
          percent={percent}
          total={total}
          totalLabel={`${quantity.pieces || 0} шт × ${formatMoney(finalPrice)}`}
          onBasePriceChange={setPrice}
          onFinalPriceChange={updateFinalPrice}
          onPercentChange={setPercent}
        />
      </section>

      <button className="add-main" onClick={addCeramic}>
        Добавить керамику
      </button>
    </section>
  );
}
