import { setupWeb3Node } from './node';

describe('setupWeb3Node', () => {
  const customWindow = global.window as CustomWindow;
  it('finds chainId correctly', async () => {
    customWindow.ethereum = {
      request: jest.fn().mockImplementation(async ({ method }) => {
        if (method === 'eth_chainId') {
          return 1;
        }
        return {};
      })
    };
    const { chainId } = await setupWeb3Node();
    expect(customWindow.ethereum.request).toHaveBeenCalledWith({
      method: 'eth_chainId',
      params: []
    });
    expect(customWindow.ethereum.request).toHaveBeenCalledWith({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }]
    });
    expect(chainId).toBe(1);
  });
});
