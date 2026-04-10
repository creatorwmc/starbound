// Deterministic star position generation from item ID
// Same item always appears at the same position on both phones
export function generateStarPosition(id, index) {
  const hash = id.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  return {
    x: 5 + (Math.abs(hash * 13 + index * 47) % 90),
    y: 5 + (Math.abs(hash * 29 + index * 61) % 75),
  };
}
