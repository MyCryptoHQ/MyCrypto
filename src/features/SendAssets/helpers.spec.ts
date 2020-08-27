import {
  fAssets,
  fNetwork,
  fAccounts,
  fERC20NonWeb3TxConfig,
  fETHNonWeb3TxConfig
} from '@fixtures';
import { translateRaw } from '@translations';
import { TTicker, TAddress, TxQueryTypes } from '@types';

import { parseQueryParams, parseTransactionQueryParams, generateGenericErc20 } from './helpers';

const validETHSpeedUpQuery = {
  type: TxQueryTypes.SPEEDUP,
  gasLimit: '0x5208',
  chainId: '3',
  nonce: '0x6',
  gasPrice: '0x12a05f200',
  from: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
  to: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
  value: '0x2386f26fc10000',
  data: '0x'
};

const validERC20SpeedUpQuery = {
  type: TxQueryTypes.SPEEDUP,
  gasLimit: '0x7d3c',
  chainId: '3',
  nonce: '0x7',
  gasPrice: '0x12a05f200',
  from: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
  to: '0xad6d458402f60fd3bd25163575031acdce07538d', // DAI contract address
  value: '0x0',
  data:
    '0xa9059cbb000000000000000000000000b2bb2b958AFa2e96dab3f3Ce7162b87daEa39017000000000000000000000000000000000000000000000000002386f26fc10000' // Transfer method call
};

const invalidSpeedUpQuery = {
  type: TxQueryTypes.SPEEDUP,
  gasLimit: '0x5208',
  chainId: '3',
  nonce: '0x60'
};

describe('Query string parsing', () => {
  it('parses valid erc20 tx query parameters correctly', () => {
    const parsedQueryParams = parseQueryParams(validERC20SpeedUpQuery)(
      [fNetwork],
      fAssets,
      fAccounts
    );
    expect(parsedQueryParams).toStrictEqual({
      type: TxQueryTypes.SPEEDUP,
      txConfig: fERC20NonWeb3TxConfig
    });
  });

  it('parses valid eth tx query parameters correctly', () => {
    const parsedQueryParams = parseQueryParams(validETHSpeedUpQuery)(
      [fNetwork],
      fAssets,
      fAccounts
    );
    expect(parsedQueryParams).toStrictEqual({
      type: TxQueryTypes.SPEEDUP,
      txConfig: fETHNonWeb3TxConfig
    });
  });

  it('fails to derive txConfig when invalid eth tx query parameters are included', () => {
    const parsedQueryParams = parseQueryParams(invalidSpeedUpQuery)([fNetwork], fAssets, fAccounts);
    expect(parsedQueryParams).toStrictEqual({ type: TxQueryTypes.SPEEDUP, txConfig: undefined });
  });

  it('fails to derive txConfig when there is no network config for specified chainID', () => {
    const parsedQueryParams = parseQueryParams(validETHSpeedUpQuery)([], fAssets, fAccounts);
    expect(parsedQueryParams).toStrictEqual({ type: TxQueryTypes.SPEEDUP, txConfig: undefined });
  });

  it('fails to derive txConfig when there is no added account with from address', () => {
    const parsedQueryParams = parseQueryParams(validETHSpeedUpQuery)([fNetwork], fAssets, []);
    expect(parsedQueryParams).toStrictEqual({ type: TxQueryTypes.SPEEDUP, txConfig: undefined });
  });
});

describe('parseTransactionQueryParams', () => {
  it('correctly parses valid erc20 speedup query params', () => {
    const parsedSpeedUpParams = parseTransactionQueryParams(validERC20SpeedUpQuery)(
      [fNetwork],
      fAssets,
      fAccounts
    );
    expect(parsedSpeedUpParams).toEqual(fERC20NonWeb3TxConfig);
  });

  it('correctly parses valid eth speedup query params', () => {
    const parsedSpeedUpParams = parseTransactionQueryParams(validETHSpeedUpQuery)(
      [fNetwork],
      fAssets,
      fAccounts
    );
    expect(parsedSpeedUpParams).toEqual(fETHNonWeb3TxConfig);
  });

  it('correctly handles invalid speedup query params', () => {
    const parsedSpeedUpParams = parseTransactionQueryParams(invalidSpeedUpQuery)(
      [fNetwork],
      fAssets,
      fAccounts
    );
    expect(parsedSpeedUpParams).toBeUndefined();
  });
});

describe('generateGenericErc20', () => {
  it('creates a generic erc20 token from contract address and chainID', () => {
    const testGenericERC20 = {
      uuid: 'e1f698bf-cb85-5405-b563-14774af14bf1',
      name: translateRaw('GENERIC_ERC20_NAME'),
      ticker: 'Unknown ERC20' as TTicker,
      type: 'erc20',
      networkId: 'Ethereum'
    };
    const genericERC20 = generateGenericErc20(
      '0x6B175474E89094C44Da98b954EedeAC495271d0F' as TAddress,
      '1',
      'Ethereum'
    );
    expect(genericERC20).toStrictEqual(testGenericERC20);
  });
});
