import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ENS from 'containers/Tabs/ENS';
import shallowWithStore from '../utils/shallowWithStore';
import { createMockStore } from 'redux-test-utils';

Enzyme.configure({ adapter: new Adapter() });

it('render snapshot', () => {
  const testState = {};
  const store = createMockStore(testState);
  const component = shallowWithStore(<ENS />, store);

  expect(component).toMatchSnapshot();
});
