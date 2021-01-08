import React from 'react';

import { DeepPartial } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { FeatureFlagProvider } from '@services';
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
  <Router>
    <Provider store={createStore(initialState).store}>
      <FeatureFlagProvider>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </FeatureFlagProvider>
    </Provider>
  </Router>
);
