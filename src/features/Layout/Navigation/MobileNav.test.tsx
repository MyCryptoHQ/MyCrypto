import { MemoryRouter } from 'react-router-dom';
import { screen, simpleRender } from 'test-utils';

import { FEATURE_FLAGS } from '@config';
import { getAppRoutesObject } from '@routing';
import { translateRaw } from '@translations';

import MobileNav from './MobileNav';

const APP_ROUTES = getAppRoutesObject(FEATURE_FLAGS);

function getComponent() {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <MobileNav appRoutes={APP_ROUTES} current={'/'} />
    </MemoryRouter>
  );
}

describe('MobileNav', () => {
  test('renders the MobileNav', async () => {
    getComponent();
    expect(screen.getByText(new RegExp(translateRaw('NAVIGATION_HOME'), 'i'))).toBeInTheDocument();
  });
});
