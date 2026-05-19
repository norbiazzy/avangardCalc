import PriceDiscountBlock from "./PriceDiscountBlock";

export default function PriceBlock({
  product,
  updateProductParam,
  finalPrice,
  productTotal,
  addBlockToCart,
  isEditing,
  cancelEdit,
}) {
  function updateFinalPrice(value) {
    if (value === "") {
      updateProductParam("percent", "");
      return;
    }

    const basePrice = Number(product.pricePerM3 || 0);
    const nextFinalPrice = Number(value || 0);

    if (!basePrice) {
      updateProductParam("pricePerM3", nextFinalPrice);
      updateProductParam("percent", 0);
      return;
    }

    const nextPercent = +(((nextFinalPrice - basePrice) / basePrice) * 100).toFixed(2);
    updateProductParam("percent", nextPercent);
  }

  return (
    <section className="card small-card">
      <PriceDiscountBlock
        basePrice={product.pricePerM3}
        finalPrice={finalPrice}
        percent={product.percent}
        total={productTotal}
        totalLabel="Сумма блоков"
        onBasePriceChange={(value) => updateProductParam("pricePerM3", value)}
        onFinalPriceChange={updateFinalPrice}
        onPercentChange={(value) => updateProductParam("percent", value)}
      >
        {isEditing ? (
          <div className="edit-buttons">
            <button className="add-main" onClick={addBlockToCart}>
              Сохранить изменения
            </button>
            <button className="cancel-edit-btn" onClick={cancelEdit}>
              Отменить изменения
            </button>
          </div>
        ) : (
          <button className="add-main" onClick={addBlockToCart}>
            Добавить блоки
          </button>
        )}
      </PriceDiscountBlock>
    </section>
  );
}
