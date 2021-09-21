import { BigNumber } from '@ethersproject/bignumber';
import { hexlify } from '@ethersproject/bytes';

import { fAccount, fAccounts, fAssets, fNetworks } from '@fixtures';
import { ITxStatus, ITxType } from '@types';

import { makeTxConfig, makeTxReceipt, possibleSolution } from './helpers';
import { ITxFaucetResult } from './types';

const exampleTXResultV1 = {
  chainId: 3,
  data: '0x',
  from: '0xa500B2427458D12Ef70dd7b1E031ef99d1cc09f7',
  gasLimit: '21000',
  gasPrice: '1000000000',
  hash: '0x5049c0847681402db2c303847f2f66ac7f3a6caf63119b676374d5781b8d11e9',
  network: 'ropsten',
  nonce: 39,
  to: fAccount.address,
  value: '1'
} as ITxFaucetResult;

const exampleTXResultV2 = {
  chainId: 3,
  data: '0x',
  from: '0xa500B2427458D12Ef70dd7b1E031ef99d1cc09f7',
  gasLimit: '21000',
  maxFeePerGas: '1000000000',
  maxPriorityFeePerGas: '1000000000',
  hash: '0x5049c0847681402db2c303847f2f66ac7f3a6caf63119b676374d5781b8d11e9',
  network: 'ropsten',
  nonce: 39,
  to: fAccount.address,
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
    test('returns expected value for type 1 tx', async () => {
      expect(
        makeTxConfig(
          exampleTXResultV1,
          fNetworks,
          fAssets,
          fAccounts,
          getContactByAddressAndNetworkId
        )
      ).toEqual({
        amount: '0.000000000000000001',
        asset: fAssets[1],
        baseAsset: fAssets[1],
        from: '0xa500B2427458D12Ef70dd7b1E031ef99d1cc09f7',
        networkId: 'Ropsten',
        rawTransaction: {
          chainId: 3,
          data: '0x',
          from: '0xa500B2427458D12Ef70dd7b1E031ef99d1cc09f7',
          gasLimit: hexlify(21000),
          gasPrice: hexlify(1000000000),
          nonce: hexlify(39),
          to: fAccount.address,
          type: 0,
          value: hexlify(1)
        },
        receiverAddress: fAccount.address,
        senderAccount: undefined
      });
    });
    test('returns expected value for type 2 tx', async () => {
      expect(
        makeTxConfig(
          exampleTXResultV2,
          fNetworks,
          fAssets,
          fAccounts,
          getContactByAddressAndNetworkId
        )
      ).toEqual({
        amount: '0.000000000000000001',
        asset: fAssets[1],
        baseAsset: fAssets[1],
        from: '0xa500B2427458D12Ef70dd7b1E031ef99d1cc09f7',
        networkId: 'Ropsten',
        rawTransaction: {
          chainId: 3,
          data: '0x',
          from: '0xa500B2427458D12Ef70dd7b1E031ef99d1cc09f7',
          gasLimit: hexlify(21000),
          maxFeePerGas: hexlify(1000000000),
          maxPriorityFeePerGas: hexlify(1000000000),
          type: 2,
          nonce: hexlify(39),
          to: fAccount.address,
          value: hexlify(1)
        },
        receiverAddress: fAccount.address,
        senderAccount: undefined
      });
    });
  });

  describe('makeTxReceipt', () => {
    const getContactByAddressAndNetworkId = jest.fn();

    test('returns expected value for type 1 tx', async () => {
      const txConfig = makeTxConfig(
        exampleTXResultV1,
        fNetworks,
        fAssets,
        fAccounts,
        getContactByAddressAndNetworkId
      );
      expect(makeTxReceipt(exampleTXResultV1, txConfig)).toEqual({
        amount: '0.000000000000000001',
        asset: fAssets[1],
        baseAsset: fAssets[1],
        data: '0x',
        from: '0xa500B2427458D12Ef70dd7b1E031ef99d1cc09f7',
        gasLimit: BigNumber.from(21000),
        gasPrice: BigNumber.from(1000000000),
        hash: '0x5049c0847681402db2c303847f2f66ac7f3a6caf63119b676374d5781b8d11e9',
        nonce: BigNumber.from(39),
        receiverAddress: fAccount.address,
        status: ITxStatus.PENDING,
        blockNumber: 0,
        timestamp: 0,
        metadata: undefined,
        to: fAccount.address,
        txType: ITxType.FAUCET,
        value: BigNumber.from('1')
      });
    });
    test('returns expected value for type 2 tx', async () => {
      const txConfig = makeTxConfig(
        exampleTXResultV2,
        fNetworks,
        fAssets,
        fAccounts,
        getContactByAddressAndNetworkId
      );
      expect(makeTxReceipt(exampleTXResultV2, txConfig)).toEqual({
        amount: '0.000000000000000001',
        asset: fAssets[1],
        baseAsset: fAssets[1],
        data: '0x',
        from: '0xa500B2427458D12Ef70dd7b1E031ef99d1cc09f7',
        gasLimit: BigNumber.from(21000),
        maxFeePerGas: BigNumber.from(1000000000),
        maxPriorityFeePerGas: BigNumber.from(1000000000),
        type: 2,
        hash: '0x5049c0847681402db2c303847f2f66ac7f3a6caf63119b676374d5781b8d11e9',
        nonce: BigNumber.from(39),
        receiverAddress: fAccount.address,
        status: ITxStatus.PENDING,
        blockNumber: 0,
        timestamp: 0,
        metadata: undefined,
        to: fAccount.address,
        txType: ITxType.FAUCET,
        value: BigNumber.from('1')
      });
    });
  });
});
