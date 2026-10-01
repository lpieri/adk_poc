export const mockGeolocation = (geolocation: Partial<Geolocation>): void => {
  Object.defineProperty(navigator, "geolocation", { configurable: true, value: geolocation });
};

export const clearGeolocation = (): void => {
  Reflect.deleteProperty(navigator, "geolocation");
};

export const makePosition = (latitude: number, longitude: number): GeolocationPosition => {
  return { coords: { latitude, longitude } } as GeolocationPosition;
};
