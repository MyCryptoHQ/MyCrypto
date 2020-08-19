import React from 'react';

import { simpleRender, screen } from 'test-utils';
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
  return simpleRender(<MigrateLS {...props} />);
};

describe('MigrateLS', () => {
  test('it has an iframe by default', () => {
    const props = { ...defaultProps };
    getComponent(props);
    expect(screen.queryByTestId('iframe')).toBeInTheDocument();
  });
});
