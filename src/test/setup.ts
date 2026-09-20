import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Recent Node versions define an experimental global localStorage getter.
// Vitest leaves globals it finds untouched, so the jsdom Storage never reaches
// window.localStorage. Bridge the real jsdom storages onto the test global
// without reading the Node getter, which logs an ExperimentalWarning.
const dom = (globalThis as { jsdom?: { window: Window } }).jsdom;
if (dom) {
  for (const key of ["localStorage", "sessionStorage"] as const) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, key);
    if (!descriptor || descriptor.get) {
      Object.defineProperty(globalThis, key, {
        value: dom.window[key],
        configurable: true,
        writable: true,
      });
    }
  }
}

// jsdom has no matchMedia. Default to a query that never matches, which is
// what a touch device looks like; tests that need hover stub it themselves.
if (typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

// Vitest only auto-cleans React Testing Library when globals are on. Cleaning
// up here keeps every test's DOM and storage isolated from the last one.
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
