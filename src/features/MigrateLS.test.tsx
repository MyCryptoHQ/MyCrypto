import React from 'react';

import { IFrame as mockIFrame } from '@components';
import { simpleRender, screen } from 'test-utils';
import { default as MigrateLS, getIFrameSrc, getLS } from './MigrateLS';

jest.mock('../components/IFrame', () => {
  return jest.fn(() => null);
});

const defaultProps = {
  importStorage: jest.fn()
};

const getComponent = (props: React.ComponentProps<typeof MigrateLS>) => {
  return simpleRender(<MigrateLS {...props} />);
};

describe('MigrateLS', () => {
  test('it is empty by default', () => {
    const props = { ...defaultProps };
    getComponent(props);
    expect(screen.queryByTestId('iframe')).not.toBeInTheDocument();
  });

  test('it places a hidden iframe if the store is not customized', () => {
    const props = { ...defaultProps, isDefault: true };
    getComponent(props);
    expect(mockIFrame).toHaveBeenCalledTimes(1);
    expect(mockIFrame).toHaveBeenCalledWith(
      {
        hidden: true,
        onLoad: expect.anything(),
        src: getIFrameSrc(window.location.hostname)
      },
      {}
    );
  });
});

describe('getIFrameSrc()', () => {
  test('it returns the landing page dev port by default', () => {
    const res = getIFrameSrc('');
    expect(res).toEqual('https://localhost:8000');
  });

  test('it returns the correct url for landing staging', () => {
    const res = getIFrameSrc('mycryptobuilds.com');
    expect(res).toEqual('https://landing.mycryptobuilds.com');
  });

  test('it returns the correct url for production', () => {
    const res = getIFrameSrc('mycrypto.com');
    expect(res).toEqual('https://beta.mycrypto.com');
  });
});

describe('getLS', () => {
  test('it can find the correct DBkey', () => {
    const frame = ({
      contentWindow: { localStorage: { MYC_Storage: { version: 'v1.0.0' } } }
    } as any) as HTMLIFrameElement;
    const res = getLS(frame);
    expect(res).toEqual(frame.contentWindow?.localStorage.MYC_Storage);
  });

  test('it returns undefined if key is absent', () => {
    const frame = ({
      contentWindow: { localStorage: { wrong_storage: { version: 'v1.0.0' } } }
    } as any) as HTMLIFrameElement;

    const res = getLS(frame);
    expect(res).toBeUndefined();
  });

  test('it returns undefined if localStorage is absent', () => {
    const frame = ({
      contentWindow: {}
    } as any) as HTMLIFrameElement;

    const res = getLS(frame);
    expect(res).toBeUndefined();
  });
});
