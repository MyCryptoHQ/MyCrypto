import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SendTransaction from 'containers/Tabs/SendTransaction';
import shallowWithStore from '../utils/shallowWithStore';
import { createMockStore } from 'redux-test-utils';
import { NODES } from 'config/data';
import { RouteComponentProps } from 'react-router';
import { createMockRouteComponentProps } from '../utils/mockRouteComponentProps';

Enzyme.configure({ adapter: new Adapter() });

it('render snapshot', () => {
  const testNode = 'rop_mew';
  const testStateConfig = {
    languageSelection: 'en',
    nodeSelection: testNode,
    node: NODES[testNode],
    gasPriceGwei: 21,
    offline: false
  };
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
  const routeProps: RouteComponentProps<any> = createMockRouteComponentProps({
    match: { path: '/account', url: '/account', isExact: true, params: {} },
    location: { pathname: '/account', search: '', hash: '', key: 'e08jz7' },
    history: {
      length: 2,
      action: 'PUSH',
      location: { pathname: '/account', search: '', hash: '', key: 'e08jz7', state: {} }
    }
  });

  const store = createMockStore(testState);
  const component = shallowWithStore(<SendTransaction {...routeProps} />, store);

  expect(component).toMatchSnapshot();
});
