import { screen, simpleRender } from 'test-utils';

import { translateRaw } from '@translations';

import { LinkSet } from '../LinkSet';

function getComponent() {
  return simpleRender(<LinkSet isMobile={true} />);
}

describe('LinkSet', () => {
  test('renders LinkSet', async () => {
    getComponent();
    expect(
      screen.getByText(new RegExp(translateRaw('NAVIGATION_GET_SOCIAL'), 'i'))
    ).toBeInTheDocument();
  });
});
