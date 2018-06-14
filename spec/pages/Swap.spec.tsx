import React from 'react';
import { RouteComponentProps } from 'react-router';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createMockStore } from 'redux-test-utils';

import { configReducer } from 'features/config/reducer';
import { INITIAL_STATE as swap } from 'features/swap/reducer';
import Swap from 'containers/Tabs/Swap';
import shallowWithStore from '../utils/shallowWithStore';
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
  const store = createMockStore({ swap, config: configReducer(undefined as any, {} as any) });
  const component = shallowWithStore(<Swap {...routeProps} />, store);

  expect(component).toMatchSnapshot();
});
