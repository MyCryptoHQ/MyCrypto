import { getIFrameSrc, getLS } from './helpers';

describe('getIFrameSrc()', () => {
  test('it returns the landing page dev port by default', () => {
    const doc = { domain: '' } as Document;
    const res = getIFrameSrc(doc);
    expect(res).toEqual('https://localhost:8000');
  });

  test('it returns the correct url for landing staging', () => {
    const doc = { domain: 'mycryptobuilds.com' } as Document;
    const res = getIFrameSrc(doc);
    expect(res).toEqual('https://landing.mycryptobuilds.com');
  });

  test('it returns the correct url for production', () => {
    const doc = { domain: 'mycrypto.com' } as Document;
    const res = getIFrameSrc(doc);
    expect(res).toEqual('https://beta.mycrypto.com');
  });
});

describe('getLS', () => {
  test('it can find the correct DBkey', () => {
    const frame = ({
      contentDocument: { localStorage: { MYC_Storage: { version: 'v1.0.0' } } }
    } as any) as HTMLIFrameElement;
    const res = getLS(frame);
    expect(res).toEqual(frame.contentWindow?.localStorage.MYC_Storage);
  });

  test('it returns undefined if key is absent', () => {
    const frame = ({
      contentDocument: { localStorage: { wrong_storage: { version: 'v1.0.0' } } }
    } as any) as HTMLIFrameElement;

    const res = getLS(frame);
    expect(res).toBeUndefined();
  });

  test('it returns undefined if localStorage is absent', () => {
    const frame = ({
      contentDocument: {}
    } as any) as HTMLIFrameElement;

    const res = getLS(frame);
    expect(res).toBeUndefined();
  });
});
