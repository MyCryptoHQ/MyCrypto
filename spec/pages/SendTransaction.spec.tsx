import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SendTransaction from 'containers/Tabs/SendTransaction';
import shallowWithStore from '../utils/shallowWithStore';
import { createMockStore } from 'redux-test-utils';
import { NODES } from 'config/data';

Enzyme.configure({ adapter: new Adapter() });

it('render snapshot', () => {
  const testNode = 'rop_mew';
  const testStateConfig = {
    languageSelection: 'en',
    nodeSelection: testNode,
    node: NODES[testNode],
    gasPriceGwei: 21,
    offline: false,
    forceOffline: false
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
    forceOffline: {},
    config: testStateConfig,
    customTokens: []
  };
  const location = {
    search:
      '?to=73640ebefe93e4d0d6e9030ee9c1866ad1f3b9f1feeb403e978c4952d8369b39'
  };
  const store = createMockStore(testState);
  const component = shallowWithStore(
    <SendTransaction location={location} />,
    store
  );

  expect(component).toMatchSnapshot();
});
