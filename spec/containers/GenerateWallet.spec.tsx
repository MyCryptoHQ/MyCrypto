import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import GenerateWallet from 'containers/Tabs/GenerateWallet';
import { createMockStore } from 'redux-test-utils';

Enzyme.configure({ adapter: new Adapter() });

const shallowWithStore = (component, store) => {
  const context = {
    store
  };
  return shallow(component, { context });
};

it('render snapshot', () => {
  const testState = {
    form: {
      walletPasswordForm: {}
    },
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
