import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import GenerateWallet from 'containers/Tabs/GenerateWallet';

Enzyme.configure({ adapter: new Adapter() });

const Test = () => <p>qwerty</p>;

it('render snapshot', () => {
  const wrapper = shallow(<GenerateWallet />);
  expect(wrapper).toMatchSnapshot();
});
