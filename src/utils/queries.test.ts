import { fERC20NonWeb3TxConfig, fETHNonWeb3TxConfig } from '@fixtures';
import { TxQueryTypes } from '@types';
import {
  constructCancelTxQuery,
  constructSpeedUpTxQuery,
  createQueryParamsDefaultObject
} from '@utils';

const legacyGasPrice = { gasPrice: '200' };
const eip1559Gas = { maxFeePerGas: '20', maxPriorityFeePerGas: '1' };

describe('constructCancelTxQuery', () => {
  it('correctly constructs a cancel tx query for an erc20 transfer', () => {
    const expectedCancelTxQuery =
      'queryType=cancel&from=0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017&to=0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017&gasLimit=0x5208&nonce=0x7&chainId=3&value=0x0&data=0x&gasPrice=0x2e90edd000';
    const txQuery = constructCancelTxQuery(fERC20NonWeb3TxConfig, legacyGasPrice);
    expect(txQuery).toEqual(expectedCancelTxQuery);
  });

  it('correctly constructs a cancel tx query for an eth tx', () => {
    const expectedCancelTxQuery =
      'queryType=cancel&from=0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017&to=0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017&gasLimit=0x5208&nonce=0x6&chainId=3&value=0x0&data=0x&gasPrice=0x2e90edd000';
    const txQuery = constructCancelTxQuery(fETHNonWeb3TxConfig, legacyGasPrice);
    expect(txQuery).toEqual(expectedCancelTxQuery);
  });

  it('correctly constructs a cancel tx query for an eth tx with EIP 1559 gas', () => {
    const expectedCancelTxQuery =
      'queryType=cancel&from=0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017&to=0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017&gasLimit=0x5208&nonce=0x6&chainId=3&value=0x0&data=0x&maxFeePerGas=0x4a817c800&maxPriorityFeePerGas=0x3b9aca00';
    const txQuery = constructCancelTxQuery(fETHNonWeb3TxConfig, eip1559Gas);
    expect(txQuery).toEqual(expectedCancelTxQuery);
  });
});

describe('constructSpeedUpTxQuery', () => {
  it('correctly constructs a speed up tx query for an erc20 transfer', () => {
    const expectedSpeedUpTxQuery =
      'queryType=speedup&from=0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017&to=0xad6d458402f60fd3bd25163575031acdce07538d&gasLimit=0x7d3c&nonce=0x7&chainId=3&value=0x0&data=0xa9059cbb000000000000000000000000b2bb2b958AFa2e96dab3f3Ce7162b87daEa39017000000000000000000000000000000000000000000000000002386f26fc10000&gasPrice=0x2e90edd000';
    const txQuery = constructSpeedUpTxQuery(fERC20NonWeb3TxConfig, legacyGasPrice);
    expect(txQuery).toEqual(expectedSpeedUpTxQuery);
  });

  it('correctly constructs a speed up tx query for an eth transaction', () => {
    const expectedSpeedUpTxQuery =
      'queryType=speedup&from=0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017&to=0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017&gasLimit=0x5208&nonce=0x6&chainId=3&value=0x2386f26fc10000&data=0x&gasPrice=0x2e90edd000';
    const txQuery = constructSpeedUpTxQuery(fETHNonWeb3TxConfig, legacyGasPrice);
    expect(txQuery).toEqual(expectedSpeedUpTxQuery);
  });

  it('correctly constructs a speed up tx query for an eth transaction with EIP 1559 gas', () => {
    const expectedSpeedUpTxQuery =
      'queryType=speedup&from=0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017&to=0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017&gasLimit=0x5208&nonce=0x6&chainId=3&value=0x2386f26fc10000&data=0x&maxFeePerGas=0x4a817c800&maxPriorityFeePerGas=0x3b9aca00';
    const txQuery = constructSpeedUpTxQuery(fETHNonWeb3TxConfig, eip1559Gas);
    expect(txQuery).toEqual(expectedSpeedUpTxQuery);
  });
});

describe('createQueryParamsDefaultObject', () => {
  it('correctly constructs a speed up tx param object for an erc20 transfer', () => {
    const defaultQueryParam = createQueryParamsDefaultObject(
      fERC20NonWeb3TxConfig,
      TxQueryTypes.SPEEDUP
    );
    expect(defaultQueryParam).toStrictEqual({
      chainId: 3,
      data:
        '0xa9059cbb000000000000000000000000b2bb2b958AFa2e96dab3f3Ce7162b87daEa39017000000000000000000000000000000000000000000000000002386f26fc10000',
      from: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
      gasLimit: '0x7d3c',
      nonce: '0x7',
      to: '0xad6d458402f60fd3bd25163575031acdce07538d',
      queryType: 'speedup',
      value: '0x0'
    });
  });

  it('correctly constructs a speed up tx param object for an eth transaction', () => {
    const defaultQueryParam = createQueryParamsDefaultObject(
      fETHNonWeb3TxConfig,
      TxQueryTypes.SPEEDUP
    );
    expect(defaultQueryParam).toStrictEqual({
      chainId: 3,
      data: '0x',
      from: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
      gasLimit: '0x5208',
      nonce: '0x6',
      to: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
      queryType: 'speedup',
      value: '0x2386f26fc10000'
    });
  });

  it('correctly constructs a cancel tx param object for an erc20 transfer', () => {
    const defaultQueryParam = createQueryParamsDefaultObject(
      fERC20NonWeb3TxConfig,
      TxQueryTypes.CANCEL
    );
    expect(defaultQueryParam).toStrictEqual({
      chainId: 3,
      data:
        '0xa9059cbb000000000000000000000000b2bb2b958AFa2e96dab3f3Ce7162b87daEa39017000000000000000000000000000000000000000000000000002386f26fc10000',
      from: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
      gasLimit: '0x7d3c',
      nonce: '0x7',
      to: '0xad6d458402f60fd3bd25163575031acdce07538d',
      queryType: 'cancel',
      value: '0x0'
    });
  });

  it('correctly constructs a cancel tx param object for an eth transaction', () => {
    const defaultQueryParam = createQueryParamsDefaultObject(
      fETHNonWeb3TxConfig,
      TxQueryTypes.CANCEL
    );
    expect(defaultQueryParam).toStrictEqual({
      chainId: 3,
      data: '0x',
      from: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
      gasLimit: '0x5208',
      nonce: '0x6',
      to: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
      queryType: 'cancel',
      value: '0x2386f26fc10000'
    });
  });
});
