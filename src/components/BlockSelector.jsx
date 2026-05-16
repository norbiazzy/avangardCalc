import SegmentedButtons from "./SegmentedButtons";
import { MANUFACTURERS } from "../data/manufacturers";
import { getAvailableOptions } from "../utils/blockOptions";

export default function BlockSelector({ product, updateProductParam, openLintelModal, showToast }) {
  const options = getAvailableOptions(product);
  const manufacturerName = MANUFACTURERS.find((item) => item.key === product.manufacturerKey)?.name;

  return (
    <section className="card">
      <h1>Калькулятор</h1>

      <SegmentedButtons
        options={MANUFACTURERS.map((item) => item.name)}
        value={manufacturerName}
        onChange={(name) => {
          const manufacturer = MANUFACTURERS.find((item) => item.name === name);
          if (!manufacturer.ready) {
            showToast("Этого производителя заполним позже", "error");
            return;
          }
          updateProductParam("manufacturerKey", manufacturer.key);
        }}
      />

      <SegmentedButtons
        options={options.densities}
        value={product.density}
        onChange={(v) => updateProductParam("density", v)}
      />

      <SegmentedButtons
        options={options.lengths}
        value={product.length}
        onChange={(v) => updateProductParam("length", v)}
      />

      <div className="width-section">
        <div className="width-grid">
          {options.widths.map((width) => (
            <button
              key={width}
              type="button"
              className={product.width === width ? "width-btn active" : "width-btn"}
              onClick={() => updateProductParam("width", width)}
            >
              {width}
            </button>
          ))}

          <button
            type="button"
            className="width-btn custom-width-btn"
            onClick={() => product.manufacturerKey === "bonolit" ? openLintelModal() : showToast("Для этого производителя добавим позже", "error")}
          >
            Другая
          </button>
        </div>
      </div>

      <SegmentedButtons
        options={options.heights}
        value={product.height}
        onChange={(v) => updateProductParam("height", v)}
      />

      <SegmentedButtons
        options={options.strengths}
        value={product.strength}
        onChange={(v) => updateProductParam("strength", v)}
      />

      <SegmentedButtons
        options={MANUFACTURERS.find((item) => item.key === product.manufacturerKey)?.factories || []}
        value={product.factory}
        onChange={(v) => updateProductParam("factory", v)}
      />

      <div className="selected-line">
        {product.manufacturer} {product.density} {product.length}×{product.width}×{product.height} {product.strength} · {product.factory}
      </div>
    </section>
  );
}
