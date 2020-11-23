import React from 'react';

import { createStore } from '@store';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import { theme } from '@theme';

/*
  Custom wrapper to enable rendered tests to consume providers data
  Ref: https://testing-library.com/docs/react-testing-library/setup
*/
export const ProvidersWrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={createStore().store}>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </Provider>
);
