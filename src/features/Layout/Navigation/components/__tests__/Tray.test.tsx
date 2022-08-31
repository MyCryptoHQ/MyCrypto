import { screen, simpleRender } from 'test-utils';

import { Tray } from '../Tray';

function getComponent() {
  return simpleRender(<Tray>Hello</Tray>);
}

describe('Navbar', () => {
  test('renders a Tray', async () => {
    getComponent();
    expect(screen.getByText(new RegExp('Hello', 'i'))).toBeInTheDocument();
  });
});
