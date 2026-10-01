import { vi } from "vitest";

export const mockReducedMotion = (matches: boolean): void => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn(() => ({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  });
};

export const clearMatchMedia = (): void => {
  Reflect.deleteProperty(window, "matchMedia");
};
