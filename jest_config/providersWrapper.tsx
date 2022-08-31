import { ComponentProps, ReactNode } from 'react';

import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { mockAppState } from 'test-utils';

import { FeatureFlagProvider } from '@services';
import { AppState, rootReducer } from '@store';
import { theme } from '@theme';

/*
  Custom wrapper to enable rendered tests to consume providers data
  Ref: https://testing-library.com/docs/react-testing-library/setup
*/
export const ProvidersWrapper = ({
  children,
  initialState = mockAppState(),
  initialRoute
}: {
  children: ReactNode;
  initialState?: AppState;
  initialRoute?: string;
}) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: (initialState as unknown) as PreloadedState<AppState>
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

/**
 * HOC to bind an initialState to our test wrappers.
 * @param state AppState
 */
export const withOptions = (
  state?: ComponentProps<typeof ProvidersWrapper>['initialState'],
  route?: ComponentProps<typeof ProvidersWrapper>['initialRoute']
) => (props: ComponentProps<typeof ProvidersWrapper>) => (
  <ProvidersWrapper initialState={state} initialRoute={route} {...props}>
    {props.children}
  </ProvidersWrapper>
);
