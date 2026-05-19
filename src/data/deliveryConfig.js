// Настройки автодоставки.
// capacityPallets = сколько паллет берет машина.
// Поля priceKey/qtyKey связаны с текущим блоком доставки.

export const DELIVERY_VEHICLES = [
  {
    key: "trailer",
    title: "Манипулятор с прицепом 20 т",
    qtyKey: "trailerQty",
    priceKey: "trailerPrice",
    capacityPallets: 20,
    priority: 1,
  },
  {
    key: "truck",
    title: "Фура",
    qtyKey: "truckQty",
    priceKey: "truckPrice",
    capacityPallets: 20,
    priority: 2,
  },
  {
    key: "manipulator",
    title: "Манипулятор 10 т",
    qtyKey: "manipulatorQty",
    priceKey: "manipulatorPrice",
    capacityPallets: 10,
    priority: 3,
  },
];
