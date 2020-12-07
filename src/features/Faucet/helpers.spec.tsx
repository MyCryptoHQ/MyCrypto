import { fAssets, fNetworks } from '@fixtures';

import { makeTxConfig, makeTxReceipt, possibleSolution } from './helpers';
import { ITxFaucetResult } from './types';

const exampleTXResult = {
  chainId: 3,
  data: '0x',
  from: '0xa500B2427458D12Ef70dd7b1E031ef99d1cc09f7',
  gasLimit: '21000',
  gasPrice: '1000000000',
  hash: '0x5049c0847681402db2c303847f2f66ac7f3a6caf63119b676374d5781b8d11e9',
  network: 'ropsten',
  nonce: 39,
  to: '0x0000000000000000000000000000000000000000',
  value: '1'
} as ITxFaucetResult;

describe('Faucet helpers', () => {
  describe('Captcha solution regex', () => {
    test('AbC0 should be a valid solution', () => {
      expect(possibleSolution('AbC0')).toBe(true);
    });
    test('AbC01 should not be a valid solution', () => {
      expect(possibleSolution('AbC01')).toBe(false);
    });
  });

  describe('makeTxConfig', () => {
    const getContactByAddressAndNetworkId = jest.fn();
    const createContact = jest.fn();
    test('matches snapshot', async () => {
      expect(
        makeTxConfig(
          exampleTXResult,
          fNetworks,
          fAssets,
          getContactByAddressAndNetworkId,
          createContact
        )
      ).toMatchSnapshot();
    });

    test('createContact was called', () => {
      expect(createContact).toHaveBeenCalledTimes(1);
      expect(createContact).toHaveBeenCalledWith({
        address: '0xa500B2427458D12Ef70dd7b1E031ef99d1cc09f7',
        label: 'MyCrypto Faucet',
        network: 'Ropsten',
        notes: ''
      });
    });
  });

  describe('makeTxReceipt', () => {
    test('matches snapshot', async () => {
      expect(makeTxReceipt(exampleTXResult, fNetworks, fAssets)).toMatchSnapshot();
    });
  });
});
