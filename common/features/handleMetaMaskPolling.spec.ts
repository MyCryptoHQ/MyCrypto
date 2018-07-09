import noop from 'lodash/noop';

import handleMetaMaskPolling, { getActualChainId } from './handleMetaMaskPolling';
import * as configNetworksSelectors from './config/networks/selectors';
import { walletSelectors } from './wallet';

jest.mock('./config/networks/selectors');
jest.mock('./wallet');

describe('getActualChainId', () => {
  it('should reject with an error if web3 does not exist', async done => {
    try {
      await getActualChainId();
    } catch (e) {
      expect(e).toBe('Web3 not found.');
      done();
    }
  });

  it('should reject with an error web3 if fails its network check', async done => {
    (global as any).web3 = {
      version: {
        getNetwork: jest.fn(callback => callback('Network check failed'))
      }
    };

    try {
      await getActualChainId();
    } catch (e) {
      expect(e).toBe('Network check failed');
      done();
    }
  });

  it('should return a chainId when everything is fine', async done => {
    (global as any).web3 = {
      version: {
        getNetwork: jest.fn(callback => callback(null, '1'))
      }
    };

    const network = await getActualChainId();

    expect(network).toBe('1');
    done();
  });
});

describe('handleMetaMaskPolling', () => {
  it('should do nothing when there is no wallet instance', async done => {
    (global as any).web3 = {
      version: {
        getNetwork: jest.fn(callback => callback(null, '1'))
      }
    };
    (walletSelectors as any).getWalletInst.mockReturnValue(null);
    (configNetworksSelectors as any).getNetworkByChainId.mockReturnValue('ETH');

    const store = {
      getState: noop,
      dispatch: noop
    };
    const result = await handleMetaMaskPolling(store as any);

    expect(result).toBe(false);
    done();
  });

  it('should reload the page if the network has changed', async done => {
    (global as any).web3 = {
      version: {
        getNetwork: jest.fn(callback => callback(null, '1'))
      }
    };
    (walletSelectors as any).getWalletInst.mockReturnValue({
      network: 'ETC'
    });
    (configNetworksSelectors as any).getNetworkByChainId.mockReturnValue('ETH');

    const store = {
      getState: noop
    };
    const result = await handleMetaMaskPolling(store as any);

    expect(result).toBe(true);
    done();
  });

  it('should reload the page if `getActualChainId` rejects', async done => {
    (global as any).web3 = {
      version: {
        getNetwork: jest.fn(callback => callback('Network check failed'))
      }
    };
    (walletSelectors as any).getWalletInst.mockReturnValue({
      network: 'ETH'
    });
    (configNetworksSelectors as any).getNetworkByChainId.mockReturnValue('ETH');

    const store = {
      getState: noop
    };
    const result = await handleMetaMaskPolling(store as any);

    expect(result).toBe(true);
    done();
  });
});
