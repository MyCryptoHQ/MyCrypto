import React from 'react';

import { configureStore, DeepPartial } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { FeatureFlagProvider } from '@services';
import { AppState, rootReducer } from '@store';
import { theme } from '@theme';

/*
  Custom wrapper to enable rendered tests to consume providers data
  Ref: https://testing-library.com/docs/react-testing-library/setup
*/
export const ProvidersWrapper = ({
  children,
  initialState,
  initialRoute
}: {
  children: React.ReactNode;
  initialState?: DeepPartial<AppState>;
  initialRoute?: string;
}) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: (initialState as unknown) as DeepPartial<AppState>
  });
  return (
    <Router initialEntries={initialRoute ? [initialRoute] : undefined}>
      <Provider store={store}>
        <FeatureFlagProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </FeatureFlagProvider>
      </Provider>
    </Router>
  );
};
