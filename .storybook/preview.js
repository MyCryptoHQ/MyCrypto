import 'font-awesome/scss/font-awesome.scss';
import 'sass/styles.scss';

import { Provider } from 'react-redux';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from 'styled-components';

import { rootReducer } from '@store';
import { theme } from '@theme';
import { FeatureFlagProvider } from '@services';
import { mockAppState } from '../jest_config/test-utils';

const store = configureStore({
  reducer: rootReducer,
  preloadedState: mockAppState()
});

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: {
    storySort: {
      method: '',
      order: ['Atoms', 'Molecules', 'Organisms', 'Features'],
      locales: ''
    }
  }
};

export const decorators = [
  (story) => (
    <Provider store={store}>
      <FeatureFlagProvider>
        <ThemeProvider theme={theme}>{story()}</ThemeProvider>
      </FeatureFlagProvider>
    </Provider>
  ),
  (story) => (
    <MemoryRouter>
      <Switch>
        <Route path="*">{story()}</Route>
      </Switch>
    </MemoryRouter>
  )
];
