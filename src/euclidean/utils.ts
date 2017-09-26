// Converts [angle] to degrees.
export function rad2deg(angle: number): number {
  return 180 * angle / Math.PI;
}

// Converts [angle] to radians.
export function deg2rad(angle: number): number {
  return Math.PI * angle / 180;
}
