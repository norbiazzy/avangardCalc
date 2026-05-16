export default function GlueBlock({
  glue,
  updateGlue,
  calculateGlueForOrder = () => {},
  addGlueToCart,
  addFoamToCart,
}) {
  return (
    <section className="card glue-card avangard-glue">
      <div className="section-mini-title">Клей и пена</div>

      <button
        className="calculate-glue-btn"
        type="button"
        onClick={calculateGlueForOrder}
      >
        Рассчитать клей
      </button>

      <div className="glue-row">
        <div className="glue-name">Клей 25 кг</div>
        <input
          type="number"
          value={glue.bagsQty}
          onChange={(e) => updateGlue("bagsQty", e.target.value === "" ? "" : Number(e.target.value))}
        />
        <div className="currency">₽</div>
        <input
          type="number"
          value={glue.bagPrice}
          onChange={(e) => updateGlue("bagPrice", e.target.value === "" ? "" : Number(e.target.value))}
        />
        <button onClick={addGlueToCart}>+</button>
      </div>

      <div className="glue-row">
        <div className="glue-name">Клей-пена</div>
        <input
          type="number"
          value={glue.foamQty}
          onChange={(e) => updateGlue("foamQty", e.target.value === "" ? "" : Number(e.target.value))}
        />
        <div className="currency">₽</div>
        <input
          type="number"
          value={glue.foamPrice}
          onChange={(e) => updateGlue("foamPrice", e.target.value === "" ? "" : Number(e.target.value))}
        />
        <button onClick={addFoamToCart}>+</button>
      </div>
    </section>
  );
}
