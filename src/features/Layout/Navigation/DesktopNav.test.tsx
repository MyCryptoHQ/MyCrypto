import { MemoryRouter } from 'react-router-dom';
import { screen, simpleRender } from 'test-utils';

import { FEATURE_FLAGS } from '@config';
import { getAppRoutesObject } from '@routing';
import { translateRaw } from '@translations';

import DesktopNav from './DesktopNav';

const APP_ROUTES = getAppRoutesObject(FEATURE_FLAGS);

const clickMock = jest.fn();

function getComponent() {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <DesktopNav appRoutes={APP_ROUTES} current={'/'} openTray={clickMock} />
    </MemoryRouter>
  );
}

describe('DesktopNav', () => {
  test('renders the DesktopNav', async () => {
    getComponent();
    expect(screen.getByText(new RegExp(translateRaw('NAVIGATION_HOME'), 'i'))).toBeInTheDocument();
  });
});
