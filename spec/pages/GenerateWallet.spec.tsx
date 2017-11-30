import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import GenerateWallet from 'containers/Tabs/GenerateWallet';
import shallowWithStore from '../utils/shallowWithStore';
import { createMockStore } from 'redux-test-utils';

Enzyme.configure({ adapter: new Adapter() });

it('render snapshot', () => {
  const testState = {
    generateWallet: {
      activeStep: {},
      password: {},
      wallet: {}
    }
  };
  const store = createMockStore(testState);
  const component = shallowWithStore(<GenerateWallet />, store);

  expect(component).toMatchSnapshot();
});
