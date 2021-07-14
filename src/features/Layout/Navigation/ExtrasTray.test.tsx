import { MemoryRouter } from 'react-router-dom';
import { screen, simpleRender } from 'test-utils';

import { translateRaw } from '@translations';

import { ExtrasTray } from './ExtrasTray';

function getComponent() {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <ExtrasTray isMobile={false} closeTray={jest.fn()} />
    </MemoryRouter>
  );
}

describe('ExtrasTray', () => {
  test('renders ExtrasTray', async () => {
    getComponent();
    expect(
      screen.getByText(new RegExp(translateRaw('NAVIGATION_EXTRAS'), 'i'))
    ).toBeInTheDocument();
  });
});
