import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import GenerateWallet from 'containers/Tabs/GenerateWallet';
import shallowWithStore from '../utils/shallowWithStore';
import { createMockStore } from 'redux-test-utils';
import { RouteComponentProps } from 'react-router-dom';
import { createMockRouteComponentProps } from '../utils/mockRouteComponentProps';

Enzyme.configure({ adapter: new Adapter() });

const routeProps: RouteComponentProps<any> = createMockRouteComponentProps({
  match: { path: '/generate', url: '/generate', isExact: true, params: {} },
  location: { pathname: '/generate', search: '', hash: '', key: '4gvanv' },
  history: {
    length: 34,
    action: 'PUSH',
    location: { pathname: '/generate', search: '', hash: '', key: '4gvanv', state: {} }
  }
});

it('render snapshot', () => {
  const testState = {
    generateWallet: {
      activeStep: {},
      password: {},
      wallet: {}
    }
  };
  const store = createMockStore(testState);
  const component = shallowWithStore(<GenerateWallet {...routeProps} />, store);

  expect(component).toMatchSnapshot();
});
