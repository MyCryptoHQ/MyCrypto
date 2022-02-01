import { generateGenericBase } from '@features/SendAssets';
import { fAssets, fNetwork } from '@fixtures';
import { ITxMetaTypes } from '@store/txHistory.slice';
import { IFullTxHistoryValueTransfer, ITxType, TAddress } from '@types';
import { generateDeterministicAddressUUID } from '@utils';

import { handleBaseAssetTransfer, handleIncExchangeTransaction, isTokenMigration } from './helpers';

describe('isTokenMigration', () => {
  it('returns true for token migrations', () => {
    expect(isTokenMigration(ITxType.REP_TOKEN_MIGRATION)).toBe(true);
    expect(isTokenMigration(ITxType.ANT_TOKEN_MIGRATION)).toBe(true);
    expect(isTokenMigration(ITxType.AAVE_TOKEN_MIGRATION)).toBe(true);
  });

  it('returns false for other types', () => {
    expect(isTokenMigration(ITxType.STANDARD)).toBe(false);
    expect(isTokenMigration(ITxType.DEFIZAP)).toBe(false);
  });
});

describe('handleBaseAssetTransfer', () => {
  const baseAsset = fAssets[0]
  const toAddr = '0x0000000000000000000000000000000000000001' as TAddress
  const fromAddr = '0x0000000000000000000000000000000000000002' as TAddress

  it('handles addition of base asset transfer on non-zero value field', () => {
    const valueField = '1000000000000000000'
    const result = handleBaseAssetTransfer([], valueField, toAddr, fromAddr, baseAsset);
    expect(result).toStrictEqual([{ asset: fAssets[0], from: fromAddr, to: toAddr, amount: '1'}]);
  });

  it('doesn\'t add base asset transfer on zero value field', () => {
    const valueField = '0'
    const result = handleBaseAssetTransfer([], valueField, toAddr, fromAddr, baseAsset);
    expect(result).toHaveLength(0);
  });
});

describe('handleIncExchangeTransaction', () => {
  const toAddr = '0x0000000000000000000000000000000000000001' as TAddress
  const fromAddr = '0x0000000000000000000000000000000000000002' as TAddress
  const valueTransfers = [] as IFullTxHistoryValueTransfer[]
  const txTypeMetas = {
    UNISWAP_V2_EXCHANGE: {
       protocol: "UNISWAP_V2",
       type: "EXCHANGE"
    },
    UNISWAP_V3_DEPOSIT: {
      protocol: "UNISWAP_V3",
      type: "DEPOSIT"
    }
  } as ITxMetaTypes;
  const accountsMap = {} as Record<string, boolean>
  

  it('handles addition of value transfer for EXCHANGE txs that require a received value transfer', () => {
    const derivedTxType = 'UNISWAP_V2_EXCHANGE'
    const accountsMap = { [generateDeterministicAddressUUID(fNetwork.id, toAddr)]: true } as Record<string, boolean>
    const valueTransfers = [{ from: toAddr, to: fromAddr, amount: undefined, asset: generateGenericBase(fNetwork.chainId.toString(), fNetwork.id)}]
    const result = handleIncExchangeTransaction(
      valueTransfers,
      txTypeMetas,
      accountsMap,
      derivedTxType,
      toAddr,
      fromAddr,
      fNetwork
    );
    expect(result).toStrictEqual([{
      asset: generateGenericBase(fNetwork.chainId.toString(), fNetwork.id),
      amount: undefined,
      from: toAddr,
      to: fromAddr
    },
    {
      asset: generateGenericBase(fNetwork.chainId.toString(), fNetwork.id),
      amount: undefined,
      from: fromAddr,
      to: toAddr
    }])
  });

  it('does not add value transfer EXCHANGE tx that doesn\'t require a received value transfer', () => {
    const derivedTxType = 'UNISWAP_V2_EXCHANGE'
    const accountsMap = { [generateDeterministicAddressUUID(fNetwork.id, toAddr)]: true } as Record<string, boolean>
    const valueTransfers = [{ from: fromAddr, to: toAddr, asset: generateGenericBase(fNetwork.chainId.toString(), fNetwork.id)}]
    const result = handleIncExchangeTransaction(
      valueTransfers,
      txTypeMetas,
      accountsMap,
      derivedTxType,
      toAddr,
      fromAddr,
      fNetwork
    );
    expect(result).toStrictEqual([{
      asset: generateGenericBase(fNetwork.chainId.toString(), fNetwork.id),
      from: "0x0000000000000000000000000000000000000002",
      to: "0x0000000000000000000000000000000000000001",
    }]);
  });

  it('does not add value transfer for txtypes that don\'t exist on txTypeMetas', () => {
    const derivedTxType = 'UNISWAP_V3_WITHDRAW'
    const result = handleIncExchangeTransaction(
      valueTransfers,
      txTypeMetas,
      accountsMap,
      derivedTxType,
      toAddr,
      fromAddr,
      fNetwork
    );
    expect(result).toHaveLength(0);
  });

  it('does not add value transfer for txtypes that are on txTypeMetas but don\'t have EXCHANGE type', () => {
    const derivedTxType = 'UNISWAP_V3_DEPOSIT'
    const result = handleIncExchangeTransaction(
      valueTransfers,
      txTypeMetas,
      accountsMap,
      derivedTxType,
      toAddr,
      fromAddr,
      fNetwork
    );
    expect(result).toHaveLength(0);
  });
});
