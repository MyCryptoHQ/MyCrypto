// Setup react-testing-library
// https://testing-library.com/docs/react-testing-library/setup#custom-render
import { render } from '@testing-library/react';
import { noOp } from '@utils';

// Mock features used by react-slider
window.matchMedia =
  window.matchMedia ||
  (() => ({
    matches: false,
    addListener: noOp,
    removeListener: noOp
  }));

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  ((callback) => {
    setTimeout(callback, 0);
  });

export const simpleRender = (ui: React.ReactElement, options?: any) => render(ui, { ...options });

// re-export everything
export * from '@testing-library/react';
