import React from 'react';

import { MemoryRouter } from 'react-router-dom';
import { screen, simpleRender } from 'test-utils';

import { translateRaw } from '@translations';

import { TopNav } from './TopNav';

function getComponent() {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <TopNav isMobile={false} current={'/'} />
    </MemoryRouter>
  );
}

describe('TopNav', () => {
  test('renders the TopNav', async () => {
    getComponent();
    expect(screen.getByText(new RegExp(translateRaw('NAVIGATION_NEW'), 'i'))).toBeInTheDocument();
  });
});
