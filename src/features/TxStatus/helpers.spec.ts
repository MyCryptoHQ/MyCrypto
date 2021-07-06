import { BigNumber } from '@ethersproject/bignumber';
import { toChecksumAddress } from 'ethereumjs-util';

import {
  fAccounts,
  fAssets,
  fETHNonWeb3TxConfig,
  fETHNonWeb3TxReceipt,
  fETHNonWeb3TxResponse,
  fETHWeb3TxResponse,
  fNetworks,
  fTxReceipt
} from '@fixtures';
import { ITxStatus, ITxType } from '@types';

import { fetchTxStatus, makeTx } from './helpers';

jest.mock('@vendor', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, jest/no-mocks-import
  const { mockFactory } = require('./__mocks__/txstatus');
  return {
    ...jest.requireActual('@vendor'),
    ...mockFactory('0xa63c5a2249d919eabc4ab38ed47846d4c01c261f1bf2f7dc5e6a7fe8860ac87d')
  };
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
    expect(result?.fetchedTx).toBeUndefined();
  });
  it('fetches tx from nodes', async () => {
    const result = await fetchTxStatus({
      txCache: [],
      networks: fNetworks,
      networkId: fNetworks[1].id,
      txHash: fTxReceipt.hash
    });
    expect(result?.cachedTx).toBeUndefined();
    expect({
      ...result?.fetchedTx,
      gasLimit: BigNumber.from(result?.fetchedTx?.gasLimit || 0),
      gasPrice: BigNumber.from(result?.fetchedTx?.gasPrice || 0),
      value: BigNumber.from(result?.fetchedTx?.value || 0)
    }).toStrictEqual({
      ...fETHWeb3TxResponse,
      gasLimit: BigNumber.from('0x7d3c'),
      value: BigNumber.from('0x00')
    });
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
        gasPrice: '0x012a05f200',
        type: undefined
      }
    });
    expect(result.receipt).toStrictEqual(
      expect.objectContaining({
        ...fETHNonWeb3TxReceipt,
        asset: fAssets[1],
        txType: ITxType.UNKNOWN,
        status: ITxStatus.UNKNOWN,
        to: toChecksumAddress(fETHNonWeb3TxReceipt.to),
        from: toChecksumAddress(fETHNonWeb3TxReceipt.from),
        receiverAddress: toChecksumAddress(fETHNonWeb3TxReceipt.receiverAddress)
      })
    );
  });
});
