export const PRACTICAL_VEHICLES = {
  truck: {
    key: "truck",
    title: "Фура",
    qtyKey: "truckQty",
    priceKey: "truckPrice",
    normal: 18,
    overload: 18,
  },
  manipulator: {
    key: "manipulator",
    title: "Манипулятор 10 т",
    qtyKey: "manipulatorQty",
    priceKey: "manipulatorPrice",
    normal: 8,
    overload: 10,
  },
  trailer: {
    key: "trailer",
    title: "Манипулятор 20 т",
    qtyKey: "trailerQty",
    priceKey: "trailerPrice",
    normal: 18,
    overload: 19,
  },
};

function ceil(value) {
  return Math.ceil(Number(value || 0));
}

export function getOrderPallets(cart) {
  return cart.reduce((sum, item) => {
    if (item.type === "block") return sum + Number(item.pallets || 0);
    if (item.type === "ceramic") return sum + Number(item.pallets || 0);
    if (item.type === "other" && item.unit === "пал.") return sum + Number(item.qty || 0);
    return sum;
  }, 0);
}

export function getOrderVolume(cart) {
  return cart.reduce((sum, item) => {
    if (item.type === "block" || item.type === "ceramic") return sum + Number(item.m3 || 0);
    if (item.type === "ublock") return sum + Number(item.volumeM3 || 0) * Number(item.qty || 0);
    if (item.type === "other" && item.unit === "м3") return sum + Number(item.qty || 0);
    return sum;
  }, 0);
}

export function getMainOrderTitle(cart) {
  const block = cart.find((item) => item.type === "block");
  if (block) return block.title;

  const first = cart[0];
  return first?.title || "Заказ";
}

function vehicleLine(vehicleKey, pallets, useOverload = false, note = "") {
  const vehicle = PRACTICAL_VEHICLES[vehicleKey];
  const normal = vehicle.normal;
  const overloadPallets = Math.max(0, pallets - normal);

  return {
    vehicleKey,
    vehicleTitle: vehicle.title,
    pallets,
    normal,
    useOverload: useOverload || overloadPallets > 0,
    overloadPallets,
    note,
  };
}

function makeVariant({
  key,
  title,
  subtitle,
  lines,
  withUnload = false,
  dogruz = "",
  priority = 0,
  warning = "",
}) {
  const totalPallets = lines.reduce((sum, line) => sum + line.pallets, 0);
  const overloadPallets = lines.reduce((sum, line) => sum + Number(line.overloadPallets || 0), 0);

  return {
    key,
    title,
    subtitle,
    lines,
    withUnload,
    dogruz,
    priority,
    warning,
    totalPallets,
    overloadPallets,
    totalRides: lines.length,
  };
}

function splitByCapacity(total, capacity) {
  const pallets = ceil(total);
  const lines = [];
  let left = pallets;

  while (left > 0) {
    const load = Math.min(capacity, left);
    lines.push(load);
    left -= load;
  }

  return lines;
}

export function calculatePracticalDelivery(cart, options = {}) {
  const pallets = ceil(getOrderPallets(cart));
  const m3 = getOrderVolume(cart);
  const allowOverload = Boolean(options.allowOverload);

  if (!pallets) {
    return {
      pallets: 0,
      m3,
      title: "Заказ",
      variants: [],
      message: "В заказе нет паллет для автодоставки",
    };
  }

  const variants = [];

  // 1. Фура 18 + манипулятор 10т на остаток + разгрузка
  if (pallets > 18 && pallets <= 26) {
    const rest = pallets - 18;
    if (rest <= PRACTICAL_VEHICLES.manipulator.normal) {
      variants.push(makeVariant({
        key: "truck-manip-unload",
        title: "Фура + манипулятор 10 т + разгрузка",
        subtitle: "Манипулятор привозит остаток и может выгрузить фуру",
        lines: [
          vehicleLine("truck", 18),
          vehicleLine("manipulator", rest),
        ],
        withUnload: true,
        priority: 1,
        warning: "Разгрузку фуры манипулятором уточнить отдельно: обычно 10–15 тыс. руб.",
      }));
    }
  }

  // 2. Фура + фура: всегда как обычный безопасный вариант
  if (pallets > 18) {
    const truckLoads = splitByCapacity(pallets, PRACTICAL_VEHICLES.truck.normal);
    variants.push(makeVariant({
      key: "truck-truck",
      title: "Фура + фура",
      subtitle: "Обычный вариант без перегруза",
      lines: truckLoads.map((load) => vehicleLine("truck", load)),
      dogruz: truckLoads[truckLoads.length - 1] < 18
        ? `Во вторую фуру можно предложить догрузить ${18 - truckLoads[truckLoads.length - 1]} паллет: блок, клей, перемычки.`
        : "",
      priority: 2,
    }));
  } else {
    variants.push(makeVariant({
      key: "one-truck",
      title: "Фура",
      subtitle: "Одна машина",
      lines: [vehicleLine("truck", pallets)],
      dogruz: pallets < 18 ? `Можно предложить догрузить ${18 - pallets} паллет.` : "",
      priority: 1,
    }));
  }

  // 3. Манипулятор 20т + манипулятор 10т без перегруза
  if (pallets > 18 && pallets <= 26) {
    const rest = pallets - 18;
    variants.push(makeVariant({
      key: "trailer-manip",
      title: "Манипулятор 20 т + манипулятор 10 т",
      subtitle: "Без фуры, удобнее если нужна разгрузка на объекте",
      lines: [
        vehicleLine("trailer", 18),
        vehicleLine("manipulator", rest),
      ],
      priority: 3,
    }));
  }

  if (allowOverload) {
    // 4. Фура 18 + манипулятор 10т с перегрузом, если остаток 9-10
    if (pallets > 26 && pallets <= 28) {
      const rest = pallets - 18;
      if (rest <= PRACTICAL_VEHICLES.manipulator.overload) {
        variants.push(makeVariant({
          key: "truck-manip-over-unload",
          title: "Фура + манипулятор 10 т с перегрузом + разгрузка",
          subtitle: "Перегруз приоритетно в 10-тонный манипулятор",
          lines: [
            vehicleLine("truck", 18),
            vehicleLine("manipulator", rest, true),
          ],
          withUnload: true,
          priority: 0,
          warning: `${Math.max(0, rest - 8)} паллет(ы) перегрузом в манипулятор 10 т. Разгрузку фуры уточнить отдельно.`,
        }));
      }
    }

    // 5. Манипулятор 20т + манипулятор 10т с распределением перегруза
    if (pallets > 26 && pallets <= 29) {
      const trailerLoad = Math.min(19, Math.max(18, pallets - 9));
      const manipLoad = pallets - trailerLoad;

      if (manipLoad <= 10) {
        variants.push(makeVariant({
          key: "trailer-manip-over",
          title: "Манипулятор 20 т + манипулятор 10 т с перегрузом",
          subtitle: "Перегруз делится между машинами",
          lines: [
            vehicleLine("trailer", trailerLoad, trailerLoad > 18),
            vehicleLine("manipulator", manipLoad, manipLoad > 8),
          ],
          priority: 1,
          warning: "Перегруз обязательно согласовать с логистом/водителем.",
        }));
      }
    }
  }

  // Fallback for larger orders: group trucks by 18 pallets.
  if (!variants.length || pallets > 29) {
    const truckLoads = splitByCapacity(pallets, 18);
    variants.push(makeVariant({
      key: "many-trucks",
      title: "Несколько фур",
      subtitle: "Базовый расчет крупного заказа",
      lines: truckLoads.map((load) => vehicleLine("truck", load)),
      dogruz: truckLoads[truckLoads.length - 1] < 18
        ? `Последнюю фуру можно догрузить на ${18 - truckLoads[truckLoads.length - 1]} паллет.`
        : "",
      priority: 5,
    }));
  }

  variants.sort((a, b) => a.priority - b.priority);

  return {
    pallets,
    m3,
    title: getMainOrderTitle(cart),
    variants,
    message: `Найдено ${variants.length} вариант(а) доставки`,
  };
}

export function variantToDeliveryPatch(variant, includeUnload = true) {
  const patch = {
    truckQty: 0,
    manipulatorQty: 0,
    trailerQty: 0,
  };

  variant.lines.forEach((line) => {
    if (line.vehicleKey === "truck") patch.truckQty += 1;
    if (line.vehicleKey === "manipulator") patch.manipulatorQty += 1;
    if (line.vehicleKey === "trailer") patch.trailerQty += 1;
  });

  if (includeUnload && variant.withUnload) {
    patch.unloadQty = 1;
  }

  return patch;
}
