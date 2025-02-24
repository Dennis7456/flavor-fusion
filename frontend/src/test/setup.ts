import { expect } from "vitest";
import "@testing-library/jest-dom/vitest";

expect.extend({
  toBeVisible(received) {
    return {
      pass: received !== null && received.style.display !== "none",
      message: () => `Expected element to be visible, but it was hidden`,
    };
  },
});