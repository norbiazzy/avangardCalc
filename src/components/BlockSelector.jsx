import SegmentedButtons from "./SegmentedButtons";
import { MANUFACTURERS } from "../data/manufacturers";
import { getAvailableOptions, getUniqueOptions } from "../utils/blockOptions";

function getDisabledOptions(allOptions, availableOptions) {
  const available = new Set(availableOptions);
  return allOptions.filter((option) => !available.has(option));
}

export default function BlockSelector({ product, updateProductParam, openLintelModal, showToast }) {
  const options = getAvailableOptions(product);
  const manufacturer = MANUFACTURERS.find((item) => item.key === product.manufacturerKey);
  const manufacturerName = manufacturer?.name;

  const base = {
    manufacturerKey: product.manufacturerKey,
    factory: product.factory,
  };

  // Полные списки держим стабильными, чтобы интерфейс не дергался.
  // Недоступные варианты остаются на месте, но становятся неактивными.
  const allDensities = getUniqueOptions("density", base);
  const allLengths = getUniqueOptions("length", base);
  const allWidths = getUniqueOptions("width", base);
  const allHeights = getUniqueOptions("height", base);
  const allStrengths = getUniqueOptions("strength", base);
  const allFactories = manufacturer?.factories || [];

  return (
    <section className="card">
      <h1>Калькулятор</h1>

      <SegmentedButtons
        options={MANUFACTURERS.map((item) => item.name)}
        value={manufacturerName}
        disabledOptions={MANUFACTURERS.filter((item) => !item.ready).map((item) => item.name)}
        onChange={(name) => {
          const nextManufacturer = MANUFACTURERS.find((item) => item.name === name);
          if (!nextManufacturer.ready) {
            showToast("Этого производителя заполним позже", "error");
            return;
          }
          updateProductParam("manufacturerKey", nextManufacturer.key);
        }}
      />

      <SegmentedButtons
        options={allDensities}
        value={product.density}
        disabledOptions={getDisabledOptions(allDensities, options.densities)}
        onChange={(v) => updateProductParam("density", v)}
      />

      <SegmentedButtons
        options={allLengths}
        value={product.length}
        disabledOptions={getDisabledOptions(allLengths, options.lengths)}
        onChange={(v) => updateProductParam("length", v)}
      />

      <div className="width-section">
        <div className="width-grid">
          {allWidths.map((width) => {
            const disabled = !options.widths.includes(width);

            return (
              <button
                key={width}
                type="button"
                disabled={disabled}
                className={[
                  "width-btn",
                  product.width === width ? "active" : "",
                  disabled ? "option-disabled" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => {
                  if (!disabled) updateProductParam("width", width);
                }}
              >
                {width}
              </button>
            );
          })}

          <button
            type="button"
            className="width-btn custom-width-btn"
            onClick={() => product.manufacturerKey === "bonolit" ? openLintelModal() : showToast("Для этого производителя добавим позже", "error")}
          >
            ...
          </button>
        </div>
      </div>

      <SegmentedButtons
        options={allHeights}
        value={product.height}
        disabledOptions={getDisabledOptions(allHeights, options.heights)}
        onChange={(v) => updateProductParam("height", v)}
      />

      <SegmentedButtons
        options={allStrengths}
        value={product.strength}
        disabledOptions={getDisabledOptions(allStrengths, options.strengths)}
        onChange={(v) => updateProductParam("strength", v)}
      />

      <SegmentedButtons
        options={allFactories}
        value={product.factory}
        onChange={(v) => updateProductParam("factory", v)}
      />

      <div className="selected-line">
        {product.manufacturer} {product.density} {product.length}×{product.width}×{product.height} {product.strength} · {product.factory}
      </div>
    </section>
  );
}
