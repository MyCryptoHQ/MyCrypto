import {
  fAssets,
  fAccounts,
  fTxReceipt,
  fNetworks,
  fETHWeb3TxResponse,
  fETHNonWeb3TxResponse,
  fETHNonWeb3TxConfig,
  fETHNonWeb3TxReceipt
} from '@fixtures';

import { makeTx, fetchTxStatus } from './helpers';
import { bigNumberify } from 'ethers/utils';
import { ITxType, ITxStatus } from '@types';
import { toChecksumAddress } from 'ethereumjs-util';

jest.mock('ethers/providers', () => {
  const { mockFactory } = require('./__mocks__/txstatus');
  return mockFactory('0xa63c5a2249d919eabc4ab38ed47846d4c01c261f1bf2f7dc5e6a7fe8860ac87d');
});

describe('fetchTxStatus', () => {
  it('fetches tx from ls', async () => {
    const result = await fetchTxStatus({
      txCache: [fTxReceipt],
      networks: fNetworks,
      networkId: fNetworks[1].id,
      txHash: fTxReceipt.hash
    });
    expect(result?.cachedTx).toStrictEqual(fTxReceipt);
    expect(result?.fetchedTx).toBe(undefined);
  });
  it('fetches tx from nodes', async () => {
    const result = await fetchTxStatus({
      txCache: [],
      networks: fNetworks,
      networkId: fNetworks[1].id,
      txHash: fTxReceipt.hash
    });
    expect(result?.cachedTx).toBe(undefined);
    expect({
      ...result?.fetchedTx,
      gasLimit: bigNumberify(result?.fetchedTx?.gasLimit || 0),
      gasPrice: bigNumberify(result?.fetchedTx?.gasPrice || 0),
      value: bigNumberify(result?.fetchedTx?.value || 0)
    }).toStrictEqual(fETHWeb3TxResponse);
  });
});

describe('makeTx', () => {
  it('creates the correct tx config and receipt from tx receipt', () => {
    const result = makeTx({
      accounts: fAccounts,
      assets: fAssets,
      networks: fNetworks,
      networkId: fNetworks[1].id,
      txHash: fTxReceipt.hash,
      cachedTx: fETHNonWeb3TxReceipt
    });
    expect(result.config).toStrictEqual({
      ...fETHNonWeb3TxConfig,
      rawTransaction: {
        ...fETHNonWeb3TxConfig.rawTransaction,
        from: fETHNonWeb3TxConfig.from,
        nonce: '0x06',
        gasPrice: '0x012a05f200'
      }
    });
    expect(result.receipt).toBe(fETHNonWeb3TxReceipt);
  });
  it('creates the correct tx config and receipt from tx response', () => {
    const result = makeTx({
      accounts: fAccounts,
      assets: fAssets,
      networks: fNetworks,
      networkId: fNetworks[1].id,
      txHash: fETHNonWeb3TxReceipt.hash,
      fetchedTx: fETHNonWeb3TxResponse
    });
    expect(result.config).toStrictEqual({
      ...fETHNonWeb3TxConfig,
      rawTransaction: {
        ...fETHNonWeb3TxConfig.rawTransaction,
        from: fETHNonWeb3TxConfig.from,
        nonce: '0x06',
        gasPrice: '0x012a05f200'
      }
    });
    expect(result.receipt).toStrictEqual({
      ...fETHNonWeb3TxReceipt,
      asset: fAssets[1],
      txType: ITxType.UNKNOWN,
      status: ITxStatus.UNKNOWN,
      to: toChecksumAddress(fETHNonWeb3TxReceipt.to),
      from: toChecksumAddress(fETHNonWeb3TxReceipt.from),
      receiverAddress: toChecksumAddress(fETHNonWeb3TxReceipt.receiverAddress)
    });
  });
});
