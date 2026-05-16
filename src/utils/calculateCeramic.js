export function calculateCeramicByPieces(pieces, product) {
  const safePieces = Number(pieces || 0);
  const m3 = +(safePieces / Number(product.pcsPerM3 || 1)).toFixed(3);
  const pallets = +(safePieces / Number(product.pcsPerPallet || 1)).toFixed(2);

  return {
    pieces: safePieces,
    m3,
    pallets,
  };
}

export function calculateCeramicByM3(m3, product) {
  const safeM3 = Number(m3 || 0);
  const pieces = Math.round(safeM3 * Number(product.pcsPerM3 || 0));
  const pallets = +(pieces / Number(product.pcsPerPallet || 1)).toFixed(2);

  return {
    pieces,
    m3: safeM3,
    pallets,
  };
}

export function calculateCeramicByPallets(pallets, product) {
  const safePallets = Number(pallets || 0);
  const pieces = Math.round(safePallets * Number(product.pcsPerPallet || 0));
  const m3 = +(pieces / Number(product.pcsPerM3 || 1)).toFixed(3);

  return {
    pieces,
    m3,
    pallets: safePallets,
  };
}

export function calculateCeramicFinalPrice(price, percent) {
  return Math.round(
    (Number(price || 0) + (Number(price || 0) * Number(percent || 0)) / 100) * 100
  ) / 100;
}

export function calculateCeramicTotal(pieces, finalPrice) {
  return Math.round(Number(pieces || 0) * Number(finalPrice || 0) * 100) / 100;
}
