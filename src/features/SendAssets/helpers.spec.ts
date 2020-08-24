import {
  fAssets,
  fNetwork,
  fAccounts,
  fERC20NonWeb3TxConfig,
  fETHNonWeb3TxConfig
} from '@fixtures';
import { translateRaw } from '@translations';
import { TTicker, TAddress } from '@types';

import { parseQueryParams, parseResubmitParams, generateGenericErc20 } from './helpers';

const validETHResubmitQuery = {
  type: 'resubmit',
  gasLimit: '0x5208',
  chainId: '3',
  nonce: '0x6',
  gasPrice: '0x12a05f200',
  from: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
  to: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
  value: '0x2386f26fc10000',
  data: '0x'
};

const validERC20ResubmitQuery = {
  type: 'resubmit',
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

const invalidResubmitQuery = {
  type: 'resubmit',
  gasLimit: '0x5208',
  chainId: '3',
  nonce: '0x60'
};

describe('Query string parsing', () => {
  it('parses valid erc20 tx query parameters correctly', () => {
    const parsedQueryParams = parseQueryParams(validERC20ResubmitQuery)(
      [fNetwork],
      fAssets,
      fAccounts
    );
    expect(parsedQueryParams).toStrictEqual({ type: 'resubmit', txConfig: fERC20NonWeb3TxConfig });
  });

  it('parses valid eth tx query parameters correctly', () => {
    const parsedQueryParams = parseQueryParams(validETHResubmitQuery)(
      [fNetwork],
      fAssets,
      fAccounts
    );
    expect(parsedQueryParams).toStrictEqual({ type: 'resubmit', txConfig: fETHNonWeb3TxConfig });
  });

  it('fails to derive txConfig when invalid eth tx query parameters are included', () => {
    const parsedQueryParams = parseQueryParams(invalidResubmitQuery)(
      [fNetwork],
      fAssets,
      fAccounts
    );
    expect(parsedQueryParams).toStrictEqual({ type: 'resubmit', txConfig: undefined });
  });

  it('fails to derive txConfig when there is no network config for specified chainID', () => {
    const parsedQueryParams = parseQueryParams(validETHResubmitQuery)([], fAssets, fAccounts);
    expect(parsedQueryParams).toStrictEqual({ type: 'resubmit', txConfig: undefined });
  });

  it('fails to derive txConfig when there is no added account with from address', () => {
    const parsedQueryParams = parseQueryParams(validETHResubmitQuery)([fNetwork], fAssets, []);
    expect(parsedQueryParams).toStrictEqual({ type: 'resubmit', txConfig: undefined });
  });
});

describe('parseResubmitParams', () => {
  it('correctly parses valid erc20 resubmit query params', () => {
    const parsedResubmitParams = parseResubmitParams(validERC20ResubmitQuery)(
      [fNetwork],
      fAssets,
      fAccounts
    );
    expect(parsedResubmitParams).toEqual(fERC20NonWeb3TxConfig);
  });

  it('correctly parses valid eth resubmit query params', () => {
    const parsedResubmitParams = parseResubmitParams(validETHResubmitQuery)(
      [fNetwork],
      fAssets,
      fAccounts
    );
    expect(parsedResubmitParams).toEqual(fETHNonWeb3TxConfig);
  });

  it('correctly handles invalid resubmit query params', () => {
    const parsedResubmitParams = parseResubmitParams(invalidResubmitQuery)(
      [fNetwork],
      fAssets,
      fAccounts
    );
    expect(parsedResubmitParams).toBeUndefined();
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
