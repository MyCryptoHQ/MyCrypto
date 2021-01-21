import { fERC20NonWeb3TxConfig, fETHNonWeb3TxConfig } from '@fixtures';
import { TxQueryTypes } from '@types';
import {
  bigify,
  constructCancelTxQuery,
  constructSpeedUpTxQuery,
  createQueryParamsDefaultObject
} from '@utils';

describe('constructCancelTxQuery', () => {
  it('correctly constructs a cancel tx query for an erc20 transfer', () => {
    const expectedCancelTxQuery =
      'type=cancel&from=0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017&to=0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017&gasLimit=0x5208&nonce=0x7&chainId=3&value=0x0&data=0x&gasPrice=0x2e90edd000';
    const testFastGasPrice = bigify(200);
    const txQuery = constructCancelTxQuery(fERC20NonWeb3TxConfig, testFastGasPrice);
    expect(txQuery).toEqual(expectedCancelTxQuery);
  });

  it('correctly constructs a cancel tx query for an eth tx', () => {
    const expectedCancelTxQuery =
      'type=cancel&from=0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017&to=0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017&gasLimit=0x5208&nonce=0x6&chainId=3&value=0x0&data=0x&gasPrice=0x2e90edd000';
    const testFastGasPrice = bigify(200);
    const txQuery = constructCancelTxQuery(fETHNonWeb3TxConfig, testFastGasPrice);
    expect(txQuery).toEqual(expectedCancelTxQuery);
  });
});

describe('constructSpeedUpTxQuery', () => {
  it('correctly constructs a speed up tx query for an erc20 transfer', () => {
    const expectedSpeedUpTxQuery =
      'type=speedup&from=0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017&to=0xad6d458402f60fd3bd25163575031acdce07538d&gasLimit=0x7d3c&nonce=0x7&chainId=3&value=0x0&data=0xa9059cbb000000000000000000000000b2bb2b958AFa2e96dab3f3Ce7162b87daEa39017000000000000000000000000000000000000000000000000002386f26fc10000&gasPrice=0x2e90edd000';
    const testFastGasPrice = bigify(200);
    const txQuery = constructSpeedUpTxQuery(fERC20NonWeb3TxConfig, testFastGasPrice);
    expect(txQuery).toEqual(expectedSpeedUpTxQuery);
  });

  it('correctly constructs a speed up tx query for an eth transaction', () => {
    const expectedSpeedUpTxQuery =
      'type=speedup&from=0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017&to=0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017&gasLimit=0x5208&nonce=0x6&chainId=3&value=0x2386f26fc10000&data=0x&gasPrice=0x2e90edd000';
    const testFastGasPrice = bigify(200);
    const txQuery = constructSpeedUpTxQuery(fETHNonWeb3TxConfig, testFastGasPrice);
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
      type: 'speedup',
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
      type: 'speedup',
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
      type: 'cancel',
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
      type: 'cancel',
      value: '0x2386f26fc10000'
    });
  });
});
