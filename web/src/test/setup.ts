import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import "../i18n";

Object.defineProperty(window, "scrollTo", { value: () => undefined, writable: true });

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
