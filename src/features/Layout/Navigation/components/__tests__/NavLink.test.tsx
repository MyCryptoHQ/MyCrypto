import { MemoryRouter } from 'react-router-dom';
import { screen, simpleRender } from 'test-utils';

import { IRouteLink } from '@types';

import { NavLink } from '../NavLink';

const defaultProps = {
  link: {
    type: 'internal',
    title: 'Home',
    to: '/',
    enabled: true,
    icon: 'nav-home'
  } as IRouteLink,
  current: false
};

function getComponent() {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <NavLink {...defaultProps} />
    </MemoryRouter>
  );
}

describe('NavLink', () => {
  test('renders a Navigation item', async () => {
    getComponent();
    expect(screen.getByText(new RegExp(defaultProps.link.title, 'i'))).toBeInTheDocument();
  });
});
