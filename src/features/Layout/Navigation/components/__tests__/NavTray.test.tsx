import React from 'react';

import { MemoryRouter } from 'react-router-dom';
import { fireEvent, screen, simpleRender } from 'test-utils';

import { INavTray } from '@types';

import { NavTray } from '../NavTray';

const defaultProps = {
  tray: {
    type: 'tray',
    title: 'Support Us',
    enabled: true,
    icon: 'nav-support-us',
    items: []
  } as INavTray,
  content: 'test'
};

function getComponent() {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <NavTray {...defaultProps} />
    </MemoryRouter>
  );
}

describe('NavTray', () => {
  test('renders the tray on mouseEnter and hides it on mouseLeave', async () => {
    getComponent();
    const TrayBtn = screen.getByText(new RegExp(defaultProps.tray.title, 'i')).parentElement!;

    fireEvent.mouseEnter(TrayBtn);
    expect(screen.getByText(new RegExp(defaultProps.content, 'i'))).toBeInTheDocument();

    fireEvent.mouseLeave(TrayBtn);
    expect(screen.queryByText(new RegExp(defaultProps.content, 'i'))).not.toBeInTheDocument();
  });
});
