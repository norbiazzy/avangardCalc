import { BLOCKS as BONOLIT_SOURCE_BLOCKS } from "./blocks";

function piecesPerPallet(length, width, height, palletM3) {
  const oneBlockM3 = (length / 1000) * (width / 1000) * (height / 1000);
  return Math.round(palletM3 / oneBlockM3);
}

function getBonolitStrengths(density) {
  if (density === "D400") return ["B2", "B2.5"];
  if (density === "D500") return ["B3.5", "B2.5"];
  if (density === "D600") return ["B5", "B3.5"];
  return ["B2.5"];
}

function bonolitBlockAllowed(block, density) {
  if (density === "D400") {
    return block.height === 250 && [250, 300, 375, 400].includes(block.width);
  }

  return true;
}

function makeBonolitBlock(block, index, factory, density, strength) {
  return {
    ...block,
    id: `bonolit-${factory}-${density}-${strength}-${block.length}-${block.height}-${block.width}-${index}`,
    manufacturerKey: "bonolit",
    manufacturer: "Bonolit",
    factory,
    density,
    strength,
  };
}

export const BONOLIT_BLOCKS = BONOLIT_SOURCE_BLOCKS.flatMap((block, index) => {
  return ["D400", "D500", "D600"].flatMap((density) => {
    if (!bonolitBlockAllowed(block, density)) return [];

    return getBonolitStrengths(density).flatMap((strength) => {
      const baseFactories = [block.factory];

      // MY должен работать как отдельный завод Bonolit.
      // Так как исходной отдельной базы MY пока нет, используем размеры SK/DZGI.
      const factories = block.factory === "SK"
        ? [...baseFactories, "MY"]
        : baseFactories;

      return factories.map((factory) =>
        makeBonolitBlock(block, index, factory, density, strength)
      );
    });
  });
});

function createIstkult(index, factory, density, strength, length, height, width, palletM3) {
  return {
    id: `istkult-${factory}-${density}-${strength}-${length}-${height}-${width}-${index}`,
    manufacturerKey: "istkult",
    manufacturer: "Исткульт",
    factory,
    density,
    strength,
    length,
    height,
    width,
    palletM3,
    piecesPerPallet: piecesPerPallet(length, width, height, palletM3),
    pricePerM3: 4500,
  };
}

const ISTKULT_ROWS = [
  ["D500", "B3.5", 625, 250, 50, 1.75],
  ["D500", "B3.5", 625, 250, 75, 1.875],
  ["D500", "B3.5", 625, 250, 100, 1.875],
  ["D500", "B3.5", 625, 250, 150, 1.875],
  ["D500", "B3.5", 625, 250, 200, 1.75],
  ["D500", "B3.5", 625, 250, 250, 1.875],
  ["D500", "B3.5", 625, 250, 300, 1.875],
  ["D500", "B3.5", 625, 250, 375, 1.875],
  ["D500", "B3.5", 625, 250, 400, 1.5],
  ["D500", "B3.5", 625, 250, 500, 1.875],

  ["D400", "B2.5", 625, 250, 300, 1.875],
  ["D400", "B2.5", 625, 250, 375, 1.875],
  ["D400", "B2.5", 625, 250, 400, 1.5],
  ["D400", "B2.5", 625, 250, 500, 1.875],

  ["D600", "B5", 625, 250, 100, 1.875],
  ["D600", "B5", 625, 250, 150, 1.875],
  ["D600", "B5", 625, 250, 200, 1.5],
  ["D600", "B5", 625, 250, 200, 1.75],
  ["D600", "B5", 625, 250, 250, 1.875],
  ["D600", "B5", 625, 250, 300, 1.875],
];

export const ISTKULT_BLOCKS = [
  ...ISTKULT_ROWS.map((row, index) => createIstkult(index + 1, "M", ...row)),
  ...ISTKULT_ROWS.map((row, index) => createIstkult(index + 1001, "E", ...row)),
];

export const ALL_BLOCKS = [
  ...BONOLIT_BLOCKS,
  ...ISTKULT_BLOCKS,
];

export const MANUFACTURERS = [
  { key: "bonolit", name: "Bonolit", factories: ["SK", "DZGI", "MY"], ready: true },
  { key: "istkult", name: "Исткульт", factories: ["M", "E"], ready: true },
  { key: "poritep", name: "Поритеп", factories: [], ready: false },
  { key: "cubiblock", name: "Кубиблок", factories: [], ready: false },
  { key: "vkblock", name: "ВКБлок", factories: [], ready: false },
];
