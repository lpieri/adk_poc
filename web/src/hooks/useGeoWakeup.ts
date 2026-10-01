import { useCallback, useEffect, useRef } from "react";
import type { WakeupResponse } from "../api/types";
import { postPresence, postWakeup } from "../api/wakeup";
import { hasGeolocation } from "../utils/geo";

export const PRESENCE_INTERVAL_MS = 60000;

interface UseGeoWakeupOptions {
  userId: string;
  sessionId: string | null;
  enabled: boolean;
  onWakeup: (response: WakeupResponse) => void;
}

export interface GeoWakeupState {
  simulate: (placeId: string) => Promise<boolean>;
}

export const useGeoWakeup = (options: UseGeoWakeupOptions): GeoWakeupState => {
  const { userId, enabled } = options;
  const sessionRef = useRef<string | null>(options.sessionId);
  const onWakeupRef = useRef<UseGeoWakeupOptions["onWakeup"]>(options.onWakeup);
  const lastSentRef = useRef<number>(0);
  useEffect(() => {
    sessionRef.current = options.sessionId;
    onWakeupRef.current = options.onWakeup;
  });
  useEffect(() => {
    if (!enabled || !hasGeolocation()) {
      return;
    }
    const handlePosition = (position: GeolocationPosition): void => {
      const now = Date.now();
      if (now - lastSentRef.current < PRESENCE_INTERVAL_MS) {
        return;
      }
      lastSentRef.current = now;
      const { latitude, longitude } = position.coords;
      postPresence({ userId, sessionId: sessionRef.current, lat: latitude, lng: longitude })
        .then((response) => {
          if (response.triggered) {
            onWakeupRef.current(response);
          }
        })
        .catch(() => undefined);
    };
    const watchId = navigator.geolocation.watchPosition(handlePosition, () => undefined, {
      enableHighAccuracy: false,
      maximumAge: PRESENCE_INTERVAL_MS,
    });
    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled, userId]);
  const simulate = useCallback(
    async (placeId: string): Promise<boolean> => {
      try {
        const response = await postWakeup(userId, sessionRef.current, placeId);
        onWakeupRef.current(response);
        return true;
      } catch {
        return false;
      }
    },
    [userId],
  );
  return { simulate };
};
