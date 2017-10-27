import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Swap from 'containers/Tabs/Swap';
import shallowWithStore from '../utils/shallowWithStore';
import { createMockStore } from 'redux-test-utils';

Enzyme.configure({ adapter: new Adapter() });

it('render snapshot', () => {
  const testState = {
    swap: {
      originAmount: {},
      destinationAmount: {},
      originKind: {},
      destinationKind: {},
      destinationKindOptions: {},
      originKindOptions: {},
      step: {},
      bityRates: {},
      bityOrder: {},
      destinationAddress: {},
      isFetchingRates: {},
      secondsRemaining: {},
      outputTx: {},
      isPostingOrder: {},
      orderStatus: {},
      paymentAddress: {}
    }
  };
  const store = createMockStore(testState);
  const component = shallowWithStore(<Swap />, store);

  expect(component).toMatchSnapshot();
});
