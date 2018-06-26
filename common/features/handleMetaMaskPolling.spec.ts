import { getActualChainId } from './handleMetaMaskPolling';

describe('getActualChainId', () => {
  it('should reject with an error if web3 does not exist', async done => {
    try {
      await getActualChainId();
    } catch (e) {
      expect(e).toBe('Web3 not found.');
      done();
    }
  });

  it('should reject with an error web3 fails its network check', async done => {
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
