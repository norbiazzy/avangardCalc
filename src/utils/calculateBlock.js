export function getBlockM3(block) {
  return (
    (block.length / 1000) *
    (block.width / 1000) *
    (block.height / 1000)
  );
}

export function calculateByM3(m3, block) {
  if (m3 === "") {
    return { m3: "", pieces: "", pallets: "" };
  }

  const oneBlockM3 = getBlockM3(block);
  const safeM3 = Number(m3 || 0);

  return {
    m3: safeM3,
    pieces: Math.round(safeM3 / oneBlockM3),
    pallets: +(safeM3 / block.palletM3).toFixed(2),
  };
}

export function calculateByPieces(pieces, block) {
  if (pieces === "") {
    return { m3: "", pieces: "", pallets: "" };
  }

  const oneBlockM3 = getBlockM3(block);
  const safePieces = Number(pieces || 0);
  const m3 = +(safePieces * oneBlockM3).toFixed(3);

  return {
    m3,
    pieces: safePieces,
    pallets: +(m3 / block.palletM3).toFixed(2),
  };
}

export function calculateByPallets(pallets, block) {
  if (pallets === "") {
    return { m3: "", pieces: "", pallets: "" };
  }

  const safePallets = Number(pallets || 0);
  const m3 = +(safePallets * block.palletM3).toFixed(3);

  return {
    m3,
    pieces: Math.round(safePallets * block.piecesPerPallet),
    pallets: safePallets,
  };
}
