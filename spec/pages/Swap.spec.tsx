import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Swap from 'containers/Tabs/Swap';
import shallowWithStore from '../utils/shallowWithStore';
import { createMockStore } from 'redux-test-utils';
import { INITIAL_STATE } from 'reducers/swap';

Enzyme.configure({ adapter: new Adapter() });

it('render snapshot', () => {
  // const testState = {
  //   swap: {
  //     step: 1,
  //     origin: null,
  //     destination: null,
  //     options: {
  //       byId: {},
  //       allIds: []
  //     },
  //     bityRates: {
  //       byId: {},
  //       allIds: []
  //     },
  //     destinationAddress: '',
  //     bityOrder: {},
  //     isFetchingRates: null,
  //     secondsRemaining: null,
  //     outputTx: null,
  //     isPostingOrder: false,
  //     orderStatus: null,
  //     orderTimestampCreatedISOString: null,
  //     paymentAddress: null,
  //     validFor: null,
  //     orderId: null
  //   }
  // };
  // const store = createMockStore(testState);
  const store = createMockStore({ swap: INITIAL_STATE });
  const component = shallowWithStore(<Swap />, store);

  expect(component).toMatchSnapshot();
});
