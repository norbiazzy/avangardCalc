import { useEffect, useMemo, useState } from "react";
import PriceDiscountBlock from "./PriceDiscountBlock";

export const OTHER_UNITS = [
  "шт",
  "м3",
  "м2",
  "м",
  "п.м.",
  "упак.",
  "л",
  "кг",
  "т",
  "меш.",
  "рул.",
  "лист",
  "компл.",
  "пал.",
  "рейс",
  "усл.",
];

const DEFAULT_FORM = {
  name: "",
  qty: "",
  unit: "шт",
  basePrice: "",
  percent: 0,
};

function normalizeUnit(unit) {
  if (unit === "м3") return "м3";
  if (unit === "м2") return "м2";
  return unit || "шт";
}

function calculateFinalPrice(basePrice, percent) {
  const base = Number(basePrice || 0);
  const value = base + (base * Number(percent || 0)) / 100;
  return Math.round(value * 100) / 100;
}

function parsePastedText(text) {
  const clean = String(text || "").trim().replace(/\s+/g, " ");
  if (!clean) return DEFAULT_FORM;

  const units = OTHER_UNITS.map((unit) => unit.replace(".", "\\.")).join("|");
  const pattern = new RegExp(`^(.*?)\\s+([0-9]+(?:[,.][0-9]+)?)\\s*(${units})?\\s+([0-9]+(?:[,.][0-9]+)?)\\s*$`, "i");
  const match = clean.match(pattern);

  if (!match) {
    return {
      ...DEFAULT_FORM,
      name: clean,
    };
  }

  return {
    name: match[1].trim(),
    qty: match[2].replace(",", "."),
    unit: normalizeUnit(match[3]),
    basePrice: match[4].replace(",", "."),
    percent: 0,
  };
}

export default function OtherSelector({
  onAddOther,
  onUpdateOther,
  editingOtherItem,
  clearEditingOther,
  showToast,
}) {
  const [form, setForm] = useState(DEFAULT_FORM);

  const finalPrice = useMemo(() => {
    return calculateFinalPrice(form.basePrice, form.percent);
  }, [form.basePrice, form.percent]);

  const total = useMemo(() => {
    return Math.round(Number(form.qty || 0) * Number(finalPrice || 0) * 100) / 100;
  }, [form.qty, finalPrice]);

  useEffect(() => {
    if (!editingOtherItem) {
      setForm(DEFAULT_FORM);
      return;
    }

    const basePrice = editingOtherItem.price ?? editingOtherItem.basePrice ?? editingOtherItem.finalPrice ?? "";

    setForm({
      name: editingOtherItem.name || editingOtherItem.title || "",
      qty: editingOtherItem.qty ?? "",
      unit: normalizeUnit(editingOtherItem.unit),
      basePrice,
      percent: editingOtherItem.percent ?? 0,
    });
  }, [editingOtherItem?.id]);

  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateFinalPrice(value) {
    if (value === "") {
      update("percent", "");
      return;
    }

    const basePrice = Number(form.basePrice || 0);
    const nextFinalPrice = Number(value || 0);

    if (!basePrice) {
      setForm((prev) => ({
        ...prev,
        basePrice: nextFinalPrice,
        percent: 0,
      }));
      return;
    }

    update("percent", +(((nextFinalPrice - basePrice) / basePrice) * 100).toFixed(2));
  }

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = parsePastedText(text);

      setForm((prev) => ({
        ...prev,
        ...parsed,
        unit: OTHER_UNITS.includes(parsed.unit) ? parsed.unit : "шт",
      }));

      showToast("Данные вставлены");
    } catch {
      showToast("Не удалось прочитать буфер обмена", "error");
    }
  }

  function resetForm() {
    setForm(DEFAULT_FORM);
    clearEditingOther?.();
  }

  function submit() {
    if (!form.name.trim()) {
      showToast("Введите наименование позиции", "error");
      return;
    }

    if (!form.qty || Number(form.qty) <= 0) {
      showToast("Введите количество", "error");
      return;
    }

    if (form.basePrice === "" || Number(form.basePrice) < 0) {
      showToast("Введите цену", "error");
      return;
    }

    const item = {
      id: editingOtherItem?.id || Date.now(),
      type: "other",
      title: form.name.trim(),
      name: form.name.trim(),
      qty: Number(form.qty),
      unit: form.unit,
      price: Number(form.basePrice),
      basePrice: Number(form.basePrice),
      percent: Number(form.percent || 0),
      finalPrice: Number(finalPrice),
      total,
      description: `${form.qty} ${form.unit} × ${finalPrice} ₽`,
    };

    if (editingOtherItem) {
      onUpdateOther(item);
      showToast("Позиция сохранена");
    } else {
      onAddOther(item);
      showToast("Позиция добавлена");
    }

    resetForm();
  }

  return (
    <section className="card other-card-main">
      <div className="other-header-main">
        <div>
          <h1>Другой товар / услуга</h1>
          <small>Быстрое добавление любой позиции в заказ</small>
        </div>

        <button className="paste-btn-main" onClick={pasteFromClipboard}>
          Вставить из буфера
        </button>
      </div>

      <label className="other-field-main">
        <span>Наименование</span>
        <input
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          placeholder="Арматура А500С 12 мм"
        />
      </label>

      <div className="other-units-grid">
        {OTHER_UNITS.map((unit) => (
          <button
            key={unit}
            type="button"
            className={form.unit === unit ? "other-unit active" : "other-unit"}
            onClick={() => update("unit", unit)}
          >
            {unit}
          </button>
        ))}
      </div>

      <div className="other-input-row other-qty-row">
        <label>
          <span>Количество</span>
          <input
            type="number"
            value={form.qty}
            onChange={(event) => update("qty", event.target.value)}
            placeholder="120"
          />
        </label>
      </div>

      <PriceDiscountBlock
        title="Цена и скидка"
        basePrice={form.basePrice}
        finalPrice={finalPrice}
        percent={form.percent}
        total={total}
        totalLabel="Сумма позиции"
        onBasePriceChange={(value) => update("basePrice", value)}
        onFinalPriceChange={updateFinalPrice}
        onPercentChange={(value) => update("percent", value)}
      />

      {editingOtherItem ? (
        <div className="edit-buttons">
          <button className="add-main" onClick={submit}>
            Сохранить изменения
          </button>

          <button className="cancel-edit-btn" onClick={resetForm}>
            Отменить изменения
          </button>
        </div>
      ) : (
        <div className="other-actions-row">
          <button className="add-main" onClick={submit}>
            Добавить в заказ
          </button>

          <button className="cancel-edit-btn" onClick={resetForm}>
            Очистить поля
          </button>
        </div>
      )}

      <div className="other-help">
        Пример вставки: <b>Арматура А500С 12 мм 120 шт 58</b>
      </div>
    </section>
  );
}
