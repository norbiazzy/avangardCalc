import { useEffect, useMemo, useState } from "react";
import { formatMoney } from "../utils/calculatePrice";

export const OTHER_UNITS = [
  "шт",
  "м³",
  "м²",
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
  price: "",
};

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
    unit: match[3] || "шт",
    price: match[4].replace(",", "."),
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

  useEffect(() => {
    if (!editingOtherItem) {
      setForm(DEFAULT_FORM);
      return;
    }

    setForm({
      name: editingOtherItem.name || editingOtherItem.title || "",
      qty: editingOtherItem.qty ?? "",
      unit: editingOtherItem.unit || "шт",
      price: editingOtherItem.price ?? "",
    });
  }, [editingOtherItem?.id]);

  const total = useMemo(() => {
    return Math.round(Number(form.qty || 0) * Number(form.price || 0) * 100) / 100;
  }, [form.qty, form.price]);

  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
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

    if (form.price === "" || Number(form.price) < 0) {
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
      price: Number(form.price),
      finalPrice: Number(form.price),
      total,
      description: `${form.qty} ${form.unit} × ${form.price} ₽`,
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

      <div className="other-input-row">
        <label>
          <span>Количество</span>
          <input
            type="number"
            value={form.qty}
            onChange={(event) => update("qty", event.target.value)}
            placeholder="120"
          />
        </label>

        <label>
          <span>Цена за ед.</span>
          <input
            type="number"
            value={form.price}
            onChange={(event) => update("price", event.target.value)}
            placeholder="58"
          />
        </label>

        <div className="other-total-box">
          <span>Сумма</span>
          <strong>{formatMoney(total)}</strong>
        </div>
      </div>

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
