import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Swap from 'containers/Tabs/Swap';
import shallowWithStore from '../utils/shallowWithStore';
import { createMockStore } from 'redux-test-utils';
import { INITIAL_STATE as swap } from 'reducers/swap';
import { INITIAL_STATE as config } from 'reducers/config';

Enzyme.configure({ adapter: new Adapter() });

it('render snapshot', () => {
  const store = createMockStore({ swap, config });
  const component = shallowWithStore(<Swap />, store);

  expect(component).toMatchSnapshot();
});
