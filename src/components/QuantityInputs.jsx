export default function QuantityInputs({ product, updateQuantityByM3, updateQuantityByPieces, updateQuantityByPallets }) {
  return (
    <section className="card small-card">
      <div className="inline-inputs three">
        <label><span>м3</span><input type="number" value={product.m3} onChange={(e) => updateQuantityByM3(e.target.value)} /></label>
        <label><span>шт.</span><input type="number" value={product.pieces} onChange={(e) => updateQuantityByPieces(e.target.value)} /></label>
        <label><span>пал</span><input type="number" value={product.pallets} onChange={(e) => updateQuantityByPallets(e.target.value)} /></label>
      </div>
    </section>
  );
}
