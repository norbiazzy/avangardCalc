import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  calculatePracticalDelivery,
  variantToDeliveryPatch,
} from "../utils/calculateAutoDelivery";

function formatQty(value) {
  const number = Number(value || 0);
  return Number.isInteger(number) ? String(number) : String(+number.toFixed(2));
}

function VariantCard({ variant, selected, onSelect, onApply }) {
  return (
    <div className={selected ? "delivery-variant-card selected" : "delivery-variant-card"}>
      <div className="delivery-variant-head">
        <div>
          <strong>{variant.title}</strong>
          <span>{variant.subtitle}</span>
        </div>

        <button type="button" onClick={onSelect}>
          Выбрать
        </button>
      </div>

      <div className="machine-group-frame">
        <div className="machine-group-title">Группа машин</div>

        {variant.lines.map((line, index) => (
          <div
            className={line.useOverload ? "auto-delivery-line overload" : "auto-delivery-line"}
            key={`${variant.key}-${index}`}
          >
            <span>
              {line.vehicleTitle}
              <em>{line.useOverload ? "перегруз" : "норма"}</em>
            </span>

            <b>{line.pallets} паллет</b>

            <div className="vehicle-load-line">
              План загрузки: {line.vehicleTitle} — {line.pallets} пал.
              {line.overloadPallets > 0 ? ` (${line.overloadPallets} пал. перегрузом)` : ""}
            </div>
          </div>
        ))}

        {variant.withUnload && (
          <div className="auto-delivery-warning">
            Разгрузка: манипулятор может выгрузить фуру. Обычно уточнять отдельно 10–15 тыс. руб.
          </div>
        )}

        {variant.dogruz && (
          <div className="dogruz-hint">
            💡 {variant.dogruz}
          </div>
        )}

        {variant.warning && (
          <div className="auto-delivery-warning">
            ⚠ {variant.warning}
          </div>
        )}
      </div>

      <button type="button" className="apply-variant-btn" onClick={onApply}>
        Применить этот вариант
      </button>
    </div>
  );
}

export default function AutoDeliveryModal({
  isOpen,
  onClose,
  cart,
  applyAutoDelivery,
  showToast,
}) {
  const [allowOverload, setAllowOverload] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");

  const plan = useMemo(
    () => calculatePracticalDelivery(cart, { allowOverload }),
    [cart, allowOverload]
  );

  const selectedVariant =
    plan.variants.find((variant) => variant.key === selectedKey) ||
    plan.variants[0] ||
    null;

  if (!isOpen) return null;

  function applyVariant(variant = selectedVariant) {
    if (!variant) {
      showToast?.("Нет варианта доставки", "error");
      return;
    }

    applyAutoDelivery(variantToDeliveryPatch(variant, true));
    showToast?.("Вариант доставки применен");
    onClose();
  }

  function copyLogisticsRequest() {
    const variant = selectedVariant;

    const variantLines = variant
      ? variant.lines
          .map((line) => {
            const overload = line.overloadPallets > 0
              ? ` (${line.overloadPallets} пал. перегрузом)`
              : "";
            return `- ${line.vehicleTitle}: ${line.pallets} пал.${overload}`;
          })
          .join("\n")
      : "- Подскажите подходящую технику";

    const text = [
      "Нужна доставка.",
      "",
      `Товар: ${plan.title}`,
      `Паллеты: ${formatQty(plan.pallets)}`,
      `Объем: ${formatQty(plan.m3)} м³`,
      "",
      "Предварительный вариант:",
      variant ? variant.title : "",
      variantLines,
      "",
      variant?.withUnload ? "Нужна разгрузка/выгрузка фуры манипулятором." : "Разгрузку уточним отдельно.",
      "Подскажите, пожалуйста, стоимость и ближайшую дату подачи.",
    ].join("\n");

    navigator.clipboard?.writeText(text);
    showToast?.("Заявка логисту скопирована");
  }

  return createPortal(
    <div className="drawer-backdrop auto-delivery-backdrop" onClick={onClose}>
      <div className="drawer-sheet auto-delivery-modal" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-handle" />

        <div className="drawer-head">
          <div>
            <h2>Автодоставка</h2>
            <small>Информационный подбор техники по паллетам</small>
          </div>

          <button className="drawer-close" onClick={onClose}>×</button>
        </div>

        <div className="auto-delivery-summary">
          <strong>{plan.title}</strong>
          <span>{formatQty(plan.pallets)} паллет · {formatQty(plan.m3)} м³</span>
        </div>

        <div className="auto-delivery-toolbar">
          <label className="overload-toggle">
            <input
              type="checkbox"
              checked={allowOverload}
              onChange={(event) => {
                setAllowOverload(event.target.checked);
                setSelectedKey("");
              }}
            />
            <span>Показать варианты с перегрузом</span>
          </label>

          <button type="button" className="logist-copy-btn" onClick={copyLogisticsRequest}>
            Скопировать заявку логисту
          </button>
        </div>

        <div className="delivery-variants-grid">
          {plan.variants.length === 0 && (
            <div className="auto-delivery-warning">
              В заказе нет паллет для подбора доставки.
            </div>
          )}

          {plan.variants.map((variant) => (
            <VariantCard
              key={variant.key}
              variant={variant}
              selected={(selectedVariant?.key || "") === variant.key}
              onSelect={() => setSelectedKey(variant.key)}
              onApply={() => applyVariant(variant)}
            />
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
