export function calculateDeliveryTotal(delivery) {
  return (
    Number(delivery.truckQty || 0) * Number(delivery.truckPrice || 0) +
    Number(delivery.manipulatorQty || 0) * Number(delivery.manipulatorPrice || 0) +
    Number(delivery.trailerQty || 0) * Number(delivery.trailerPrice || 0) +
    Number(delivery.unloadQty || 0) * Number(delivery.unloadPrice || 0) +
    Number(delivery.uncouplingQty || 0) * Number(delivery.uncouplingPrice || 0)
  );
}

export function getDeliveryItems(delivery) {
  const items = [];

  if (Number(delivery.truckQty || 0) > 0) {
    items.push({
      key: "truck",
      title: Number(delivery.truckQty) === 1 ? "Доставка" : "Фура",
      qty: Number(delivery.truckQty),
      price: Number(delivery.truckPrice || 0),
      total: Number(delivery.truckQty) * Number(delivery.truckPrice || 0),
    });
  }

  if (Number(delivery.manipulatorQty || 0) > 0) {
    items.push({
      key: "manipulator",
      title: "Манипулятор 10 т",
      qty: Number(delivery.manipulatorQty),
      price: Number(delivery.manipulatorPrice || 0),
      total: Number(delivery.manipulatorQty) * Number(delivery.manipulatorPrice || 0),
    });
  }

  if (Number(delivery.trailerQty || 0) > 0) {
    items.push({
      key: "trailer",
      title: "Манипулятор 20 т",
      qty: Number(delivery.trailerQty),
      price: Number(delivery.trailerPrice || 0),
      total: Number(delivery.trailerQty) * Number(delivery.trailerPrice || 0),
    });
  }

  if (Number(delivery.unloadQty || 0) > 0) {
    items.push({
      key: "unload",
      title: "Разгрузка",
      qty: Number(delivery.unloadQty),
      price: Number(delivery.unloadPrice || 0),
      total: Number(delivery.unloadQty) * Number(delivery.unloadPrice || 0),
    });
  }

  if (Number(delivery.uncouplingQty || 0) > 0) {
    items.push({
      key: "uncoupling",
      title: "Расцепка",
      qty: Number(delivery.uncouplingQty),
      price: Number(delivery.uncouplingPrice || 0),
      total: Number(delivery.uncouplingQty) * Number(delivery.uncouplingPrice || 0),
    });
  }

  return items;
}
