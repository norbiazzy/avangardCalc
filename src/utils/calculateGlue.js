export function calculateGlueBags(m3) {
  return Math.ceil(Number(m3 || 0) * 1.15);
}

export function calculateFoamBalloons(m3) {
  return Math.ceil(Number(m3 || 0) / 2);
}
