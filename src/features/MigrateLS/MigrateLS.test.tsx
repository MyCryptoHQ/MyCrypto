import React from 'react';

import { MemoryRouter as Router } from 'react-router-dom';
import { screen, simpleRender } from 'test-utils';

import { default as MigrateLS } from './MigrateLS';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn()
  })
}));

const defaultProps = {
  importStorage: jest.fn(),
  isValidImport: jest.fn()
};

const getComponent = (props: React.ComponentProps<typeof MigrateLS>) => {
  return simpleRender(
    <Router>
      <MigrateLS {...props} />
    </Router>
  );
};

describe('MigrateLS', () => {
  test('it has an iframe by default', () => {
    const props = { ...defaultProps };
    getComponent(props);
    expect(screen.queryByTestId('iframe')).toBeInTheDocument();
  });
  test('it displays a support prompt by default', () => {
    const props = { ...defaultProps, isDefault: true };
    getComponent(props);
    expect(screen.getByText(/MyCrypto is better with accounts!/i)).toBeInTheDocument();
  });
});
