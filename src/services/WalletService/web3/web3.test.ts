import { fAccount, fNetworks } from '@fixtures';

import { unlockWeb3 } from './web3';

describe('unlockWeb3', () => {
  const customWindow = global.window as CustomWindow;
  it('supports wallet_getPermissions', async () => {
    customWindow.ethereum = {
      request: jest.fn().mockImplementation(async ({ method }) => {
        if (method === 'eth_chainId') {
          return 1;
        } else if (method === 'wallet_requestPermissions') {
          return [
            {
              '@context': ['https://github.com/MetaMask/rpc-cap'],
              invoker: 'https://localhost:3000',
              parentCapability: 'eth_accounts',
              id: 'd6fec666-0796-433a-b905-ab1f051db900',
              date: 1622549870051,
              caveats: [
                { type: 'limitResponseLength', value: 1, name: 'primaryAccountOnly' },
                {
                  type: 'filterResponse',
                  value: [fAccount.address],
                  name: 'exposedAccounts'
                }
              ]
            }
          ];
        } else if (method === 'wallet_getPermissions') {
          return [
            {
              '@context': ['https://github.com/MetaMask/rpc-cap'],
              invoker: 'https://localhost:3000',
              parentCapability: 'eth_accounts',
              id: '09dff28b-6d5c-4bdd-bde9-c9b5109687ec',
              date: 1622549393015,
              caveats: [
                { type: 'limitResponseLength', value: 1, name: 'primaryAccountOnly' },
                {
                  type: 'filterResponse',
                  value: [fAccount.address],
                  name: 'exposedAccounts'
                }
              ]
            }
          ];
        }
        return null;
      })
    };
    const wallets = await unlockWeb3(fNetworks);
    expect(customWindow.ethereum.request).toHaveBeenCalledWith({
      method: 'eth_chainId',
      params: []
    });
    expect(customWindow.ethereum.request).toHaveBeenCalledWith({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }]
    });
    expect(customWindow.ethereum.request).toHaveBeenCalledWith({
      method: 'wallet_getPermissions',
      params: []
    });
    expect(wallets.map((w) => w.getAddress())).toEqual([fAccount.address]);
  });

  it('falls back to eth_accounts', async () => {
    customWindow.ethereum = {
      enable: jest.fn(),
      request: jest.fn().mockImplementation(async ({ method }) => {
        if (method === 'eth_chainId') {
          return 1;
        } else if (method === 'eth_accounts') {
          return [fAccount.address];
        }
        return null;
      })
    };
    const wallets = await unlockWeb3(fNetworks);
    expect(customWindow.ethereum.enable).toHaveBeenCalled();
    expect(customWindow.ethereum.request).toHaveBeenCalledWith({
      method: 'eth_chainId',
      params: []
    });
    expect(customWindow.ethereum.request).toHaveBeenCalledWith({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }]
    });
    expect(customWindow.ethereum.request).toHaveBeenCalledWith({
      method: 'eth_accounts',
      params: []
    });
    expect(wallets.map((w) => w.getAddress())).toEqual([fAccount.address]);
  });

  it('supports legacy web3', async () => {
    customWindow.ethereum = null;
    customWindow.web3 = {
      currentProvider: {
        sendAsync: jest.fn().mockImplementation(async ({ method }, callback) => {
          if (method === 'eth_chainId') {
            return callback(null, { result: 1 });
          } else if (method === 'eth_accounts') {
            return callback(null, { result: [fAccount.address] });
          }
          return callback('Not supported');
        })
      }
    };
    const wallets = await unlockWeb3(fNetworks);
    expect(customWindow.web3.currentProvider.sendAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'eth_chainId',
        params: []
      }),
      expect.any(Function)
    );
    expect(customWindow.web3.currentProvider.sendAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'wallet_getPermissions',
        params: []
      }),
      expect.any(Function)
    );
    expect(customWindow.web3.currentProvider.sendAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'eth_accounts',
        params: []
      }),
      expect.any(Function)
    );
    expect(wallets.map((w) => w.getAddress())).toEqual([fAccount.address]);
  });

  it('fails if window.ethereum is null', async () => {
    customWindow.ethereum = null;
    customWindow.web3 = null;
    await expect(unlockWeb3(fNetworks)).rejects.toEqual(
      new Error('Web3 not found. Please check that MetaMask is installed')
    );
  });
});
