import { fTransaction } from '@fixtures';

/* eslint-disable jest/no-done-callback */
import { ethereumMock } from './ethereumMock';

jest.mock('@ethersproject/wallet', () => ({
  Wallet: jest.fn().mockImplementation(() => ({
    address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
    sendTransaction: jest.fn().mockImplementation(() => ({
      hash: '0xb04887c8b6cb3c19edb88940d6f5f64a1df8100cd61e15012dda3047892eface'
    }))
  }))
}));

jest.mock('@ethersproject/providers', () => ({
  ...jest.requireActual('@ethersproject/providers'),
  JsonRpcProvider: jest.fn().mockImplementation(() => ({
    send: jest.fn()
  }))
}));

const renderMock = () => {
  const mock = ethereumMock();
  mock.initialize('privatekey', 3, '');
  return mock;
};

describe('ethereumMock', () => {
  it('enable returns a promise that resolves to the address', async () => {
    const mock = renderMock();
    await expect(mock.enable()).resolves.toStrictEqual([
      '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520'
    ]);
  });

  it('sendAsync returns chosen chainId for net_version', async (done) => {
    const mock = renderMock();
    function callback(_: any, data: any) {
      try {
        expect(data).toStrictEqual(expect.objectContaining({ result: '3', id: 1 }));
        done();
      } catch (error) {
        done(error);
      }
    }

    mock.sendAsync({ method: 'net_version', id: 1, params: [] }, callback);
  });

  it('sendAsync returns chosen address for eth_accounts', async (done) => {
    const mock = renderMock();
    function callback(_: any, data: any) {
      try {
        expect(data).toStrictEqual(
          expect.objectContaining({ result: ['0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520'], id: 1 })
        );
        done();
      } catch (error) {
        done(error);
      }
    }

    mock.sendAsync({ method: 'eth_accounts', id: 1, params: [] }, callback);
  });

  it('sendAsync returns chosen address for eth_sendTransaction', async (done) => {
    const mock = renderMock();
    function callback(_: any, data: any) {
      try {
        expect(data).toStrictEqual(
          expect.objectContaining({
            result: '0xb04887c8b6cb3c19edb88940d6f5f64a1df8100cd61e15012dda3047892eface',
            id: 1
          })
        );
        done();
      } catch (error) {
        done(error);
      }
    }

    mock.sendAsync(
      {
        method: 'eth_sendTransaction',
        id: 1,
        params: [fTransaction]
      },
      callback
    );
  });

  it('sendAsync returns null invalid methods', async (done) => {
    const mock = renderMock();
    function callback(_: any, data: any) {
      try {
        expect(data).toStrictEqual(
          expect.objectContaining({
            result: undefined,
            id: 1
          })
        );
        done();
      } catch (error) {
        done(error);
      }
    }

    mock.sendAsync(
      {
        method: 'invalid',
        id: 1,
        params: []
      },
      callback
    );
  });

  it('has event functions', async () => {
    const mock = renderMock();
    expect(mock.on).toBeDefined();
    expect(mock.removeAllListeners).toBeDefined();
  });
});
