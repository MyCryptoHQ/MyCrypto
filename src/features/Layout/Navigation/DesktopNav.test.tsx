import React from 'react';

import { MemoryRouter } from 'react-router-dom';
import { screen, simpleRender } from 'test-utils';

import { FeatureFlagProvider } from '@services';
import { translateRaw } from '@translations';

import DesktopNav from './DesktopNav';

function getComponent() {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <FeatureFlagProvider>
        <DesktopNav />
      </FeatureFlagProvider>
    </MemoryRouter>
  );
}

describe('DesktopNav', () => {
  test('renders the DesktopNav', async () => {
    getComponent();
    expect(screen.getByText(new RegExp(translateRaw('NAVIGATION_HOME'), 'i'))).toBeInTheDocument();
  });
});
