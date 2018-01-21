import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ENS from 'containers/Tabs/ENS';
import shallowWithStore from '../utils/shallowWithStore';
import { createMockStore } from 'redux-test-utils';
import { createMockRouteComponentProps } from '../utils/mockRouteComponentProps';
import { RouteComponentProps } from 'react-router';

Enzyme.configure({ adapter: new Adapter() });

const routeProps: RouteComponentProps<any> = createMockRouteComponentProps({
  match: { path: '/ens', url: '/ens', isExact: false, params: {} },
  location: { pathname: '/ens', search: '', hash: '', key: 'e08jz7' },
  history: {
    length: 2,
    action: 'PUSH',
    location: { pathname: '/ens', search: '', hash: '', key: 'e08jz7', state: {} }
  }
});

describe('snapshot test', () => {
  it('ENS component', () => {
    const testState = {};
    const store = createMockStore(testState);
    const component = shallowWithStore(<ENS {...routeProps} />, store);

    expect(component).toMatchSnapshot();
  });
});
