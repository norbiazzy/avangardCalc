// Цены блоков.
// Менять цены удобнее здесь.
// manufacturerKey: bonolit, istkult, poritep, cubiblock, vkblock
// factory: завод
// thickness = ширина блока в мм.

export const BLOCK_PRICE_RULES = [
  // Bonolit
  { manufacturerKey: "bonolit", density: "D400", strengths: ["B2", "B2.5"], thicknesses: [250, 300, 375, 400], pricePerM3: 6048 },

  { manufacturerKey: "bonolit", density: "D500", strength: "B3.5", thicknesses: [200, 250, 300, 350, 375, 400], pricePerM3: 5568 },
  { manufacturerKey: "bonolit", density: "D500", strength: "B2.5", thicknesses: [200, 250, 300, 350, 375, 400], pricePerM3: 5424 },
  { manufacturerKey: "bonolit", density: "D500", strength: "B3.5", thicknesses: [75, 100, 125, 150], pricePerM3: 5664 },
  { manufacturerKey: "bonolit", density: "D500", strength: "B2.5", thicknesses: [75, 100, 125, 150], pricePerM3: 5520 },
  { manufacturerKey: "bonolit", density: "D500", strengths: ["B3.5", "B2.5"], thicknesses: [50], pricePerM3: 6624 },

  { manufacturerKey: "bonolit", density: "D600", strength: "B3.5", thicknesses: [200, 250, 300, 350, 375, 400], pricePerM3: 5520 },
  { manufacturerKey: "bonolit", density: "D600", strength: "B5", thicknesses: [200, 250, 300, 350, 375, 400], pricePerM3: 5664 },
  { manufacturerKey: "bonolit", density: "D600", strength: "B3.5", thicknesses: [75, 100, 125, 150], pricePerM3: 5616 },
  { manufacturerKey: "bonolit", density: "D600", strength: "B5", thicknesses: [75, 100, 125, 150], pricePerM3: 5760 },

  // Исткульт, завод M
  // Специальные цены должны идти выше общей цены.
  { manufacturerKey: "istkult", factory: "M", density: "D500", thicknesses: [50], pricePerM3: 5800 },
  { manufacturerKey: "istkult", factory: "M", density: "D500", thicknesses: [75, 100], pricePerM3: 5500 },
  { manufacturerKey: "istkult", factory: "M", density: "D400", thicknesses: [375, 400], pricePerM3: 5800 },
  { manufacturerKey: "istkult", factory: "M", density: "D400", thicknesses: [300, 500], pricePerM3: 5400 },
  { manufacturerKey: "istkult", factory: "M", density: "D500", thicknesses: [150, 200, 250, 300, 375, 400, 500], pricePerM3: 5400 },
  { manufacturerKey: "istkult", factory: "M", density: "D600", thicknesses: [100, 150, 200, 250, 300], pricePerM3: 5400 },

  // Исткульт, завод E
  { manufacturerKey: "istkult", factory: "E", density: "D500", thicknesses: [75, 100], pricePerM3: 5400 },
  { manufacturerKey: "istkult", factory: "E", density: "D500", thicknesses: [50, 150, 200, 250, 300, 375, 400, 500], pricePerM3: 5300 },
  { manufacturerKey: "istkult", factory: "E", density: "D400", thicknesses: [300, 375, 400, 500], pricePerM3: 5300 },
  { manufacturerKey: "istkult", factory: "E", density: "D600", thicknesses: [100, 150, 200, 250, 300], pricePerM3: 5300 },
];

export function getBlockPrice({ manufacturerKey, factory, density, strength, width }) {
  const rule = BLOCK_PRICE_RULES.find((item) => {
    const manufacturerOk = item.manufacturerKey === manufacturerKey;
    const factoryOk = item.factory ? item.factory === factory : true;
    const densityOk = item.density === density;
    const strengthOk = item.strength
      ? item.strength === strength
      : item.strengths
        ? item.strengths.includes(strength)
        : true;
    const thicknessOk = item.thicknesses.includes(Number(width));

    return manufacturerOk && factoryOk && densityOk && strengthOk && thicknessOk;
  });

  return rule?.pricePerM3 || 4500;
}
