import { screen, simpleRender } from 'test-utils';

import { Navbar } from '../Navbar';

function getComponent() {
  return simpleRender(<Navbar>Hello</Navbar>);
}

describe('Navbar', () => {
  test('renders the NavBar', async () => {
    getComponent();
    expect(screen.getByText(new RegExp('Hello', 'i'))).toBeInTheDocument();
  });
});
