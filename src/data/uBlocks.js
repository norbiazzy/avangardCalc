export const U_BLOCK_DEFAULT_PRICE_PER_M3 = 13000;

export const U_BLOCK_OPTIONS = {
  densities: ["D500"],
  lengths: [500],
  widths: [400, 375, 350, 300, 250, 200],
  heights: [250, 200],
};

export function getUBlockVolumeM3({ length, width, height }) {
  return +(
    (Number(length || 0) / 1000) *
    (Number(width || 0) / 1000) *
    (Number(height || 0) / 1000)
  ).toFixed(4);
}

export function getUBlockPiecePrice({ length, width, height, pricePerM3 }) {
  const volume = getUBlockVolumeM3({ length, width, height });
  return Math.round(volume * Number(pricePerM3 || 0));
}

export function makeUBlockTitle({ density, length, width, height }) {
  return `U-блок ${density} ${length}*${width}*${height}`;
}
