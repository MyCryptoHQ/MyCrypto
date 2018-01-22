import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Swap from 'containers/Tabs/Swap';
import shallowWithStore from '../utils/shallowWithStore';
import { createMockStore } from 'redux-test-utils';
import { INITIAL_STATE as swap } from 'reducers/swap';
import { INITIAL_STATE as config } from 'reducers/config';
import { RouteComponentProps } from 'react-router';
import { createMockRouteComponentProps } from '../utils/mockRouteComponentProps';

Enzyme.configure({ adapter: new Adapter() });

const routeProps: RouteComponentProps<any> = createMockRouteComponentProps({
  match: { path: '/swap', url: '/swap', isExact: true, params: {} },
  location: { pathname: '/swap', search: '', hash: '', key: 'e08jz7' },
  history: {
    length: 2,
    action: 'PUSH',
    location: { pathname: '/swap', search: '', hash: '', key: 'e08jz7', state: {} }
  }
});

it('render snapshot', () => {
  const store = createMockStore({ swap, config });
  const component = shallowWithStore(<Swap {...routeProps} />, store);

  expect(component).toMatchSnapshot();
});
