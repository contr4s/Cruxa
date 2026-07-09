import { useState, useEffect } from 'react';

export function useUserLocation() {
  const [loc, setLoc] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => console.warn('[Geo] Location unavailable:', err),
      { enableHighAccuracy: false, timeout: 5000 },
    );
  }, []);

  return loc;
}
