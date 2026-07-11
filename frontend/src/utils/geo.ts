export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} м`;
  return `${km.toFixed(1)} км`;
}

export function gymDistance(lat?: number, lon?: number, userLat?: number, userLon?: number): string | null {
  if (lat == null || lon == null || userLat == null || userLon == null) return null;
  const R = 6371;
  const dLat = ((lat - userLat) * Math.PI) / 180;
  const dLon = ((lon - userLon) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((userLat * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return formatDistance(km);
}
