// Setup react-testing-library
// https://testing-library.com/docs/react-testing-library/setup#custom-render
import { render } from '@testing-library/react';
import { RenderHookOptions, renderHook as rtlRenderHook } from '@testing-library/react-hooks';
// eslint-disable-next-line import/no-namespace
import * as ReactRedux from 'react-redux';

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

export const renderHook = (hook: () => any, options: RenderHookOptions<unknown>) => {
  return rtlRenderHook(hook, { wrapper: ProvidersWrapper, ...options });
};

// wrapper option : Wrap renders with our providers so components can consume it
export const simpleRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: ProvidersWrapper, ...options });

// Generate 'dispatch' for the reducer that is being tested
export const createStore = <S>(reducer: (state: S, action: TAction<any, any>) => S) => (
  action: TAction<any, any>
) => (state: S) => reducer(state, action);

/**
 * For testing redux store interactions
 */
export const getUseDispatchMock = () => {
  const mockDispatch = jest.fn();
  jest.spyOn(ReactRedux, 'useDispatch').mockReturnValue(mockDispatch);
  return mockDispatch;
};

export const actionWithPayload = (payload: any) => expect.objectContaining({ payload });

// re-export everything
export * from '@testing-library/react';
