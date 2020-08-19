import React from 'react';

// import { IFrame as mockIFrame } from '@components';
import { simpleRender, screen } from 'test-utils';
import { default as MigrateLS } from './MigrateLS';
// import { getIFrameSrc } from './helpers';

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
  test('it is empty by default', () => {
    const props = { ...defaultProps };
    getComponent(props);
    expect(screen.queryByTestId('iframe')).toBeInTheDocument();
  });

  // test('it places a hidden iframe when the user had no custom settings', () => {
  //   const dummy = jest.fn(() => null);
  //   jest.doMock('../../components/IFrame', () => {
  //     return {
  //       __esModule: true,
  //       default: jest.fn(() => null)
  //     };
  //   });

  //   return import('../../components/IFrame').then((moduleName) => {
  //     const props = { ...defaultProps, isDefault: true };
  //     getComponent(props);
  //     expect(mockIFrame).toHaveBeenCalledTimes(1);
  //     expect(mockIFrame).toHaveBeenCalledWith(
  //       {
  //         hidden: true,
  //         onLoad: expect.anything(),
  //         src: getIFrameSrc({ location: { hostname: '' } } as Window)
  //       },
  //       {}
  //     );
  //   });
  // });

  // test('it allows the user to refuse the migration', () => {
  //   const props = { ...defaultProps, isDefault: true };

  //   getComponent(props);

  //   const v = screen.getByTestId('iframe');
  //   screen.debug();

  //   fireEvent.click();
  //   expect(screen.getByText(/error message/)).toBeInTheDocument();
  // });
});
