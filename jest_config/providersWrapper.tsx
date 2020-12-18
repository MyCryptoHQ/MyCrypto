import React from 'react';

import { DeepPartial } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import { AppState, createStore } from '@store';
import { theme } from '@theme';

/*
  Custom wrapper to enable rendered tests to consume providers data
  Ref: https://testing-library.com/docs/react-testing-library/setup
*/
export const ProvidersWrapper = ({
  children,
  initialState
}: {
  children: React.ReactNode;
  initialState?: DeepPartial<AppState>;
}) => (
  <Provider store={createStore(initialState).store}>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </Provider>
);
