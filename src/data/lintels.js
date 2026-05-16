export const LINTELS = [
  { id: "p-1500-100-700", category: "1500", baseSize: "1500*100*250", load: 700, shortTitle: "D600 1500*100*250/700", fullTitle: "Перемычка брусковая Poritep D600 1500*100*250/700 B3,5 ТУ", price: 828.75 },
  { id: "p-1500-150-700", category: "1500", baseSize: "1500*150*250", load: 700, shortTitle: "D600 1500*150*250/700", fullTitle: "Перемычка брусковая Poritep D600 1500*150*250/700 B3,5 ТУ", price: 1209.38 },
  { id: "p-1500-200-700", category: "1500", baseSize: "1500*200*250", load: 700, shortTitle: "D600 1500*200*250/700", fullTitle: "Перемычка брусковая Poritep D600 1500*200*250/700 B3,5 ТУ", price: 1612.5 },
  { id: "p-1500-200-3250", category: "1500", baseSize: "1500*200*250", load: 3250, shortTitle: "D600 1500*200*250/3250", fullTitle: "Перемычка брусковая Poritep D600 1500*200*250/3250 B3,5 ТУ", price: 1860 },

  { id: "p-2000-100-400", category: "2000", baseSize: "2000*100*250", load: 400, shortTitle: "D600 2000*100*250/400", fullTitle: "Перемычка брусковая Poritep D600 2000*100*250/400 B3,5 ТУ", price: 1105 },
  { id: "p-2000-150-400", category: "2000", baseSize: "2000*150*250", load: 400, shortTitle: "D600 2000*150*250/400", fullTitle: "Перемычка брусковая Poritep D600 2000*150*250/400 B3,5 ТУ", price: 1612.5 },
  { id: "p-2000-200-1800", category: "2000", baseSize: "2000*200*250", load: 1800, shortTitle: "D600 2000*200*250/1800", fullTitle: "Перемычка брусковая Poritep D600 2000*200*250/1800 B3,5 ТУ", price: 2480 },
  { id: "p-2000-200-400", category: "2000", baseSize: "2000*200*250", load: 400, shortTitle: "D600 2000*200*250/400", fullTitle: "Перемычка брусковая Poritep D600 2000*200*250/400 B3,5 ТУ", price: 2150 },
  { id: "p-2000-300-1850", category: "2000", baseSize: "2000*300*250", load: 1850, shortTitle: "D600 2000*300*250/1850", fullTitle: "Перемычка брусковая Poritep D600 2000*300*250/1850 B3,5 ТУ", price: 3720 },

  { id: "p-2500-150-350", category: "2500", baseSize: "2500*150*250", load: 350, shortTitle: "D600 2500*150*250/350", fullTitle: "Перемычка брусковая Poritep D600 2500*150*250/350 B3,5 ТУ", price: 2015.63 },
  { id: "p-2500-200-1100", category: "2500", baseSize: "2500*200*250", load: 1100, shortTitle: "D600 2500*200*250/1100", fullTitle: "Перемычка брусковая Poritep D600 2500*200*250/1100 B3,5 ТУ", price: 3100 },
  { id: "p-2500-200-350", category: "2500", baseSize: "2500*200*250", load: 350, shortTitle: "D600 2500*200*250/350", fullTitle: "Перемычка брусковая Poritep D600 2500*200*250/350 B3,5 ТУ", price: 2687.5 },
  { id: "p-2500-300-1500", category: "2500", baseSize: "2500*300*250", load: 1500, shortTitle: "D600 2500*300*250/1500", fullTitle: "Перемычка брусковая Poritep D600 2500*300*250/1500 B3,5 ТУ", price: 4650 },

  { id: "p-3000-150-300", category: "3000", baseSize: "3000*150*250", load: 300, shortTitle: "D600 3000*150*250/300", fullTitle: "Перемычка брусковая Poritep D600 3000*150*250/300 B3,5 ТУ", price: 2418.75 },
  { id: "p-3000-200-750", category: "3000", baseSize: "3000*200*250", load: 750, shortTitle: "D600 3000*200*250/750", fullTitle: "Перемычка брусковая Poritep D600 3000*200*250/750 B3,5 ТУ", price: 3720 },
  { id: "p-3000-300-1000", category: "3000", baseSize: "3000*300*250", load: 1000, shortTitle: "D600 3000*300*250/1000", fullTitle: "Перемычка брусковая Poritep D600 3000*300*250/1000 B3,5 ТУ", price: 5580 },
];

export function isReinforcedLintel(lintel) {
  const sameBase = LINTELS.filter((item) => item.baseSize === lintel.baseSize);
  if (sameBase.length <= 1) return false;
  const maxLoad = Math.max(...sameBase.map((item) => item.load));
  return lintel.load === maxLoad;
}
