import {
  fAccounts,
  fAdvancedERC20TxSendFormikFields,
  fAdvancedETHTxSendFormikFields,
  fAssets,
  fERC20NonWeb3TxConfig,
  fERC20TxSendFormikFields,
  fETHNonWeb3TxConfig,
  fETHTxSendFormikFields,
  fETHTxSendFormikFieldsEIP1559,
  fNetwork
} from '@fixtures';
import { translateRaw } from '@translations';
import { ILegacyTxObject, TAddress, TTicker, TxQueryTypes } from '@types';

import {
  generateGenericErc20,
  isERC20Asset,
  parseQueryParams,
  parseTransactionQueryParams,
  processFormDataToTx,
  processFormForEstimateGas
} from './helpers';

const validETHSpeedUpQuery = {
  queryType: TxQueryTypes.SPEEDUP,
  gasLimit: '0x5208',
  chainId: '3',
  nonce: '0x6',
  gasPrice: '0x12a05f200',
  from: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
  to: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
  value: '0x2386f26fc10000',
  data: '0x'
};

const validETHSpeedUpQueryEIP1559 = {
  queryType: TxQueryTypes.SPEEDUP,
  gasLimit: '0x5208',
  chainId: '3',
  nonce: '0x6',
  maxFeePerGas: '0x4a817c800',
  maxPriorityFeePerGas: '0x3b9aca00',
  from: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
  to: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
  value: '0x2386f26fc10000',
  data: '0x'
};

const validERC20SpeedUpQuery = {
  queryType: TxQueryTypes.SPEEDUP,
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
  queryType: TxQueryTypes.SPEEDUP,
  gasLimit: '0x5208',
  chainId: '3',
  nonce: '0x60'
};

const validETHCancelQuery = {
  queryType: TxQueryTypes.CANCEL,
  gasLimit: '0x5208',
  chainId: '3',
  nonce: '0x6',
  gasPrice: '0x12a05f200',
  from: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
  to: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
  value: '0x2386f26fc10000',
  data: '0x'
};

const validERC20CancelQuery = {
  queryType: TxQueryTypes.CANCEL,
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

const invalidCancelQuery = {
  queryType: TxQueryTypes.CANCEL,
  gasLimit: '0x5208',
  chainId: '3',
  nonce: '0x60'
};

describe('Query string parsing', () => {
  it('parses valid erc20 tx query parameters correctly - speed up', () => {
    const parsedQueryParams = parseQueryParams(validERC20SpeedUpQuery)(
      [fNetwork],
      fAssets,
      fAccounts
    );
    expect(parsedQueryParams).toStrictEqual({
      queryType: TxQueryTypes.SPEEDUP,
      txConfig: fERC20NonWeb3TxConfig
    });
  });

  it('parses valid eth tx query parameters correctly - speed up', () => {
    const parsedQueryParams = parseQueryParams(validETHSpeedUpQuery)(
      [fNetwork],
      fAssets,
      fAccounts
    );
    expect(parsedQueryParams).toStrictEqual({
      queryType: TxQueryTypes.SPEEDUP,
      txConfig: fETHNonWeb3TxConfig
    });
  });

  it('parses valid eth tx query parameters correctly - speed up EIP 1559', () => {
    const parsedQueryParams = parseQueryParams(validETHSpeedUpQueryEIP1559)(
      [fNetwork],
      fAssets,
      fAccounts
    );
    const { gasPrice, ...rawTransaction } = fETHNonWeb3TxConfig.rawTransaction as ILegacyTxObject;
    expect(parsedQueryParams).toStrictEqual({
      queryType: TxQueryTypes.SPEEDUP,
      txConfig: {
        ...fETHNonWeb3TxConfig,
        rawTransaction: {
          ...rawTransaction,
          maxFeePerGas: '0x4a817c800',
          maxPriorityFeePerGas: '0x3b9aca00',
          type: 2
        }
      }
    });
  });

  it('parses valid erc20 tx query parameters correctly - cancel', () => {
    const parsedQueryParams = parseQueryParams(validERC20CancelQuery)(
      [fNetwork],
      fAssets,
      fAccounts
    );
    expect(parsedQueryParams).toStrictEqual({
      queryType: TxQueryTypes.CANCEL,
      txConfig: fERC20NonWeb3TxConfig
    });
  });

  it('parses valid eth tx query parameters correctly - cancel', () => {
    const parsedQueryParams = parseQueryParams(validETHCancelQuery)([fNetwork], fAssets, fAccounts);
    expect(parsedQueryParams).toStrictEqual({
      queryType: TxQueryTypes.CANCEL,
      txConfig: fETHNonWeb3TxConfig
    });
  });

  it('fails to derive txConfig when invalid eth tx query parameters are included - cancel', () => {
    const parsedQueryParams = parseQueryParams(invalidCancelQuery)([fNetwork], fAssets, fAccounts);
    expect(parsedQueryParams).toStrictEqual({
      queryType: TxQueryTypes.CANCEL,
      txConfig: undefined
    });
  });

  it('fails to derive txConfig when there is no network config for specified chainID - cancel', () => {
    const parsedQueryParams = parseQueryParams(validETHCancelQuery)([], fAssets, fAccounts);
    expect(parsedQueryParams).toStrictEqual({
      queryType: TxQueryTypes.CANCEL,
      txConfig: undefined
    });
  });

  it('fails to derive txConfig when there is no added account with from address - cancel', () => {
    const parsedQueryParams = parseQueryParams(validETHCancelQuery)([fNetwork], fAssets, []);
    expect(parsedQueryParams).toStrictEqual({
      queryType: TxQueryTypes.CANCEL,
      txConfig: undefined
    });
  });

  it('fails to derive txConfig when invalid eth tx query parameters are included - speed up', () => {
    const parsedQueryParams = parseQueryParams(invalidSpeedUpQuery)([fNetwork], fAssets, fAccounts);
    expect(parsedQueryParams).toStrictEqual({
      queryType: TxQueryTypes.SPEEDUP,
      txConfig: undefined
    });
  });

  it('fails to derive txConfig when there is no network config for specified chainID - speed up', () => {
    const parsedQueryParams = parseQueryParams(validETHSpeedUpQuery)([], fAssets, fAccounts);
    expect(parsedQueryParams).toStrictEqual({
      queryType: TxQueryTypes.SPEEDUP,
      txConfig: undefined
    });
  });

  it('fails to derive txConfig when there is no added account with from address - speed up', () => {
    const parsedQueryParams = parseQueryParams(validETHSpeedUpQuery)([fNetwork], fAssets, []);
    expect(parsedQueryParams).toStrictEqual({
      queryType: TxQueryTypes.SPEEDUP,
      txConfig: undefined
    });
  });

  it('fails on invalid input', () => {
    const parsedQueryParams = parseQueryParams({ queryType: undefined })([fNetwork], fAssets, []);
    expect(parsedQueryParams).toStrictEqual({
      queryType: TxQueryTypes.DEFAULT
    });
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

describe('isERC20Asset', () => {
  it('correctly determines base asset', () => {
    expect(isERC20Asset(fAssets[0])).toBe(false);
  });

  it('correctly determines erc20 asset', () => {
    // Expects ropsten dai to be the last asset in fAssets
    expect(isERC20Asset(fAssets[fAssets.length - 1])).toBe(true);
  });
});

describe('processFormDataToTx', () => {
  it('correctly process eth form data to eth tx', () => {
    expect(processFormDataToTx(fETHTxSendFormikFields)).toMatchSnapshot();
  });

  it('correctly process eth form data to eth tx for EIP 1559', () => {
    expect(processFormDataToTx(fETHTxSendFormikFieldsEIP1559)).toMatchSnapshot();
  });

  it('correctly process advanced eth form data to eth tx', () => {
    expect(processFormDataToTx(fAdvancedETHTxSendFormikFields)).toMatchSnapshot();
  });

  it('correctly process erc20 form data to erc20 tx', () => {
    expect(processFormDataToTx(fERC20TxSendFormikFields)).toMatchSnapshot();
  });

  it('correctly process advanced erc20 form data to erc20 tx', () => {
    expect(processFormDataToTx(fAdvancedERC20TxSendFormikFields)).toMatchSnapshot();
  });
});

describe('processFormForEstimateGas', () => {
  it('correctly process eth form data for gas limit estimate', () => {
    expect(processFormForEstimateGas(fETHTxSendFormikFields)).toMatchSnapshot();
  });

  it('correctly process erc20 form data for gas limit estimate', () => {
    expect(processFormForEstimateGas(fERC20TxSendFormikFields)).toMatchSnapshot();
  });

  it('correctly process advanced eth form data for gas limit estimate', () => {
    expect(processFormForEstimateGas(fAdvancedETHTxSendFormikFields)).toMatchSnapshot();
  });

  it('correctly process advanced erc20 form data for gas limit estimate', () => {
    expect(processFormForEstimateGas(fAdvancedERC20TxSendFormikFields)).toMatchSnapshot();
  });
});
