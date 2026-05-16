import { ALL_BLOCKS, MANUFACTURERS } from "../data/manufacturers";

const DENSITY_ORDER = {
  istkult: ["D400", "D500", "D600"],
  bonolit: ["D400", "D500", "D600"],
};

function sortValues(values, field, product = {}) {
  if (field === "density") {
    const order = DENSITY_ORDER[product.manufacturerKey] || ["D400", "D500", "D600"];
    return values.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }

  return values.sort((a, b) => Number(a) - Number(b));
}

export function getManufacturer(key) {
  return MANUFACTURERS.find((item) => item.key === key) || MANUFACTURERS[0];
}

export function getUniqueOptions(field, filters = {}) {
  const values = [
    ...new Set(
      ALL_BLOCKS
        .filter((block) =>
          Object.entries(filters).every(([key, value]) => !value || block[key] === value)
        )
        .map((block) => block[field])
    ),
  ];

  return sortValues(values, field, filters);
}

export function getAvailableOptions(product) {
  const base = { manufacturerKey: product.manufacturerKey, factory: product.factory };

  const densities = getUniqueOptions("density", base);
  const density = densities.includes(product.density) ? product.density : densities[0];

  const strengths = getUniqueOptions("strength", { ...base, density });
  const strength = strengths.includes(product.strength) ? product.strength : strengths[0];

  const lengths = getUniqueOptions("length", { ...base, density, strength });
  const length = lengths.includes(product.length) ? product.length : lengths[0];

  const heights = getUniqueOptions("height", { ...base, density, strength, length });
  const height = heights.includes(product.height) ? product.height : heights[0];

  const widths = getUniqueOptions("width", { ...base, density, strength, length, height });

  return { densities, strengths, lengths, heights, widths };
}

export function normalizeProduct(product) {
  const manufacturer = getManufacturer(product.manufacturerKey);
  const factory = manufacturer.factories.includes(product.factory)
    ? product.factory
    : manufacturer.factories[0];

  let draft = { ...product, factory };

  const densities = getUniqueOptions("density", {
    manufacturerKey: draft.manufacturerKey,
    factory: draft.factory,
  });
  if (!densities.includes(draft.density)) draft.density = densities[0];

  const strengths = getUniqueOptions("strength", {
    manufacturerKey: draft.manufacturerKey,
    factory: draft.factory,
    density: draft.density,
  });
  if (!strengths.includes(draft.strength)) draft.strength = strengths[0];

  const lengths = getUniqueOptions("length", {
    manufacturerKey: draft.manufacturerKey,
    factory: draft.factory,
    density: draft.density,
    strength: draft.strength,
  });
  if (!lengths.includes(draft.length)) draft.length = lengths[0];

  const heights = getUniqueOptions("height", {
    manufacturerKey: draft.manufacturerKey,
    factory: draft.factory,
    density: draft.density,
    strength: draft.strength,
    length: draft.length,
  });
  if (!heights.includes(draft.height)) draft.height = heights[0];

  const widths = getUniqueOptions("width", {
    manufacturerKey: draft.manufacturerKey,
    factory: draft.factory,
    density: draft.density,
    strength: draft.strength,
    length: draft.length,
    height: draft.height,
  });
  if (!widths.includes(draft.width)) draft.width = widths[0];

  return draft;
}

export function findClosestBlock(params) {
  const p = normalizeProduct(params);

  return (
    ALL_BLOCKS.find((block) =>
      block.manufacturerKey === p.manufacturerKey &&
      block.factory === p.factory &&
      block.density === p.density &&
      block.strength === p.strength &&
      block.length === p.length &&
      block.height === p.height &&
      block.width === p.width
    ) ||
    ALL_BLOCKS.find((block) => block.manufacturerKey === p.manufacturerKey && block.factory === p.factory) ||
    ALL_BLOCKS.find((block) => block.manufacturerKey === p.manufacturerKey) ||
    ALL_BLOCKS[0]
  );
}
