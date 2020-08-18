import {
  fAssets,
  fNetwork,
  fAccounts,
  fERC20NonWeb3TxConfig,
  fETHNonWeb3TxConfig
} from '@fixtures';

import { parseQueryParams } from './helpers';

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

describe('Query string bs', () => {
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
