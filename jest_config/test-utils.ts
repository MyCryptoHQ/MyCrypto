// Setup react-testing-library
// https://testing-library.com/docs/react-testing-library/setup#custom-render
import { render } from '@testing-library/react';

import { TAction } from '@types';
import { noOp } from '@utils';

import { ProvidersWrapper } from './providersWrapper';

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

// wrapper option : Wrap renders with our providers so components can consume it
export const simpleRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: ProvidersWrapper, ...options });

// Generate 'dispatch' for the reducer that is being tested
export const createStore = <S>(reducer: (state: S, action: TAction<any, any>) => S) => (
  action: TAction<any, any>
) => (state: S) => reducer(state, action);

// re-export everything
export * from '@testing-library/react';
