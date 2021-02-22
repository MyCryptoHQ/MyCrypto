import 'font-awesome/scss/font-awesome.scss';
import 'sass/styles.scss';

import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { mockAppState } from '../jest_config/test-utils';

const mockStore = configureStore([]);
const store = mockStore(mockAppState());

import AppProviders from '../src/AppProviders';

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
  //  (story) => (
  //    <Provider store={store}>
  //      <AppProviders>{story()}</AppProviders>
  //    </Provider>
  //  ),
  (story) => <Provider store={store}>{story()}</Provider>,
  (story) => (
    <MemoryRouter>
      <Switch>
        <Route path="*">{story()}</Route>
      </Switch>
    </MemoryRouter>
  )
];
