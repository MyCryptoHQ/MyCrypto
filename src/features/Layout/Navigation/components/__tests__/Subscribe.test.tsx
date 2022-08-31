import { screen, simpleRender } from 'test-utils';

import { translateRaw } from '@translations';

import { Subscribe } from '../Subscribe';

function getComponent() {
  return simpleRender(<Subscribe />);
}

describe('Subscribe', () => {
  test('renders Subscribe', async () => {
    getComponent();
    expect(
      screen.getByText(new RegExp(translateRaw('NAVIGATION_SUBSCRIBE_TO_MYC'), 'i'))
    ).toBeInTheDocument();
  });
});
