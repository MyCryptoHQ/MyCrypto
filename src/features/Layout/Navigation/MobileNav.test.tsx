import React from 'react';

import { MemoryRouter } from 'react-router-dom';
import { screen, simpleRender } from 'test-utils';

import { FeatureFlagProvider } from '@services';
import { translateRaw } from '@translations';

import MobileNav from './MobileNav';

function getComponent() {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <FeatureFlagProvider>
        <MobileNav />
      </FeatureFlagProvider>
    </MemoryRouter>
  );
}

describe('MobileNav', () => {
  test('renders the MobileNav', async () => {
    getComponent();
    expect(screen.getByText(new RegExp(translateRaw('NAVIGATION_HOME'), 'i'))).toBeInTheDocument();
  });
});
