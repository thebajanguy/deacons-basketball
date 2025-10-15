import 'jest-preset-angular/setup-jest';
import 'zone.js/testing';

// Optional shim some libs expect
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (q: string) => ({
    matches: false, media: q, onchange: null,
    addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {},
    dispatchEvent: () => false
  })
});
