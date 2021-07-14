import { MemoryRouter } from 'react-router-dom';
import { screen, simpleRender } from 'test-utils';

import { IRouteLink } from '@types';

import { TrayItem } from '../TrayItem';

const defaultProps = {
  item: {
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
      <TrayItem {...defaultProps} />
    </MemoryRouter>
  );
}

describe('NavLink', () => {
  test('renders a Tray item', async () => {
    getComponent();
    expect(screen.getByText(new RegExp(defaultProps.item.title, 'i'))).toBeInTheDocument();
  });
});
