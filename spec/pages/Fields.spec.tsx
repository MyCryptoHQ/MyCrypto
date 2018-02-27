import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createMockStore } from 'redux-test-utils';
import shallowWithStore from '../utils/shallowWithStore';
import { createMockRouteComponentProps } from '../utils/mockRouteComponentProps';
import Fields from 'containers/tabs/SendTransaction';
import { RouteComponentProps } from 'react-router';
import { config } from 'reducers/config';

Enzyme.configure({ adapter: new Adapter() });

const routeProps: RouteComponentProps<any> = createMockRouteComponentProps({
  match: { path: '/account/send', url: '/account/send', isExact: true, params: {} },
  location: { pathname: '/account/send', search: '', hash: '', key: 'e08jz7' },
  history: {
    length: 2,
    action: 'PUSH',
    location: { pathname: '/account/send', search: '', hash: '', key: 'e08jz7', state: {} }
  }
});

it('should render fields component', () => {
  const testStateConfig = config(undefined as any, {} as any);
  const testState = {
    wallet: {},
    balance: {},
    tokenBalances: {},
    node: {},
    nodeLib: {},
    network: {},
    tokens: [],
    gasPrice: {},
    transactions: {},
    offline: {},
    config: testStateConfig,
    customTokens: []
  };
  const store = createMockStore(testState);
  const component = shallowWithStore(<Fields {...routeProps} />, store);
  expect(component).toMatchSnapshot();
});
