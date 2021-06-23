import { ReactElement } from 'react';

// Setup react-testing-library
// https://testing-library.com/docs/react-testing-library/setup#custom-render
import { DeepPartial } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
// eslint-disable-next-line import/no-namespace
import * as ReactRedux from 'react-redux';
import { expectSaga } from 'redux-saga-test-plan';

import { SCHEMA_BASE } from '@database/data/schema';
import { marshallState } from '@services/Store/DataManager/utils';
import { AppState, persistenceSlice } from '@store';
import { DataStore, TAction } from '@types';
import { noOp } from '@utils';

import { ProvidersWrapper, withOptions } from './providersWrapper';

// Workaround due to circular dependency issues
export const APP_STATE = marshallState(SCHEMA_BASE);

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

/**
 * For testing redux store interactions
 */
export const mockUseDispatch = () => {
  const mockDispatch = jest.fn();
  jest.spyOn(ReactRedux, 'useDispatch').mockReturnValue(mockDispatch);
  return mockDispatch;
};

export const mockUseSelector = () => {
  const mockSelector = jest.fn();
  return mockSelector;
};

export const actionWithPayload = (payload: any) => expect.objectContaining({ payload });

expectSaga.DEFAULT_TIMEOUT = 100;

// wrapper option : Wrap renders with our providers so components can consume it
export const simpleRender = (ui: ReactElement, options?: any) => {
  if (options?.initialState || options?.initialRoute) {
    return render(ui, {
      wrapper: withOptions(options.initialState, options.initialRoute),
      ...options
    });
  } else {
    return render(ui, { wrapper: ProvidersWrapper, ...options });
  }
};

// Generate 'dispatch' for the reducer that is being tested
export const createStore = <S>(reducer: (state: S, action: TAction<any, any>) => S) => (
  action: TAction<any, any>
) => (state: S) => reducer(state, action);

// re-export everything
export * from '@testing-library/react';
export { ProvidersWrapper };
export * from 'redux-saga-test-plan';

/**
 * Provides a mock state. Can mock the entire DataStore of a specific key.
 */

export function mockAppState(sliceState?: Partial<DataStore>): AppState {
  if (sliceState) {
    return ({
      [persistenceSlice.name]: sliceState
    } as unknown) as AppState;
  } else {
    return ({
      [persistenceSlice.name]: APP_STATE
    } as unknown) as AppState;
  }
}

/**
 * Remove console.error when we expect toThrow.
 * Helps prevent error logs blowing up as a result of expecting an error to be thrown,
 * when using a library (such as enzyme)
 * https://github.com/facebook/jest/issues/5785#issuecomment-769475904
 *
 * @param func Function that you would normally pass to `expect(func).toThrow()`
 */
export const expectToThrow = (func: () => unknown, error?: JestToErrorArg): void => {
  // Even though the error is caught, it still gets printed to the console
  // so we mock that out to avoid the wall of red text.
  const spy = jest.spyOn(console, 'error');
  spy.mockImplementation(noOp);

  expect(func).toThrow(error);

  spy.mockRestore();
};

type JestToErrorArg = Parameters<jest.Matchers<unknown, () => unknown>['toThrow']>[0];

export function mockStore({
  storeSlice,
  dataStoreState
}: {
  storeSlice?: DeepPartial<AppState>;
  dataStoreState?: Partial<DataStore>;
}): AppState {
  return {
    ...mockAppState(dataStoreState),
    ...storeSlice
  } as AppState;
}
