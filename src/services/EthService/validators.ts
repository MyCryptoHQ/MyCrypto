import { BigNumber as EthersBN } from '@ethersproject/bignumber';
import { ResolutionError } from '@unstoppabledomains/resolution';
import BigNumber from 'bignumber.js';
import { toChecksumAddress } from 'ethereumjs-util';
import { Validator } from 'jsonschema';
import { isValidChecksumAddress as isValidChecksumRSKAddress } from 'rskjs-util';

import {
  CREATION_ADDRESS,
  DEFAULT_ASSET_DECIMAL,
  dPathRegex,
  DPathsList as DPaths,
  GAS_LIMIT_LOWER_BOUND,
  GAS_LIMIT_UPPER_BOUND,
  GAS_PRICE_GWEI_LOWER_BOUND,
  GAS_PRICE_GWEI_UPPER_BOUND
} from '@config';
import translate, { translateRaw } from '@translations';
import { InlineMessageType, JsonRPCResponse, Web3RequestPermissionsResponse } from '@types';
import { baseToConvertedUnit, bigify, convertedToBaseUnit, gasStringsToMaxGasBN } from '@utils';

import { isValidENSName } from './ens/validators';

export const isValidPositiveOrZeroInteger = (value: BigNumber | number | string) =>
  isValidPositiveNumber(value) && isInteger(value);

export const isValidNonZeroInteger = (value: number | string) =>
  isValidPositiveOrZeroInteger(value) && isPositiveNonZeroNumber(value);

export const isValidPositiveNumber = (value: BigNumber | number | string) =>
  bigify(value).isFinite() && bigify(value).gte(0);

const isPositiveNonZeroNumber = (value: BigNumber | number | string) => bigify(value).gt(0);

const isInteger = (value: BigNumber | number | string) => bigify(value).isInteger();

export function isChecksumAddress(address: string): boolean {
  return address === toChecksumAddress(address);
}

export function isBurnAddress(address: string): boolean {
  return (
    address === '0x0000000000000000000000000000000000000000' ||
    address === '0x000000000000000000000000000000000000dead'
  );
}

export function isValidRSKAddress(address: string, chainId: number): boolean {
  return isValidETHLikeAddress(address, isValidChecksumRSKAddress(address, chainId));
}

function getIsValidAddressFunction(chainId: number) {
  if (chainId === 30 || chainId === 31) {
    return (address: string) => isValidRSKAddress(address, chainId);
  }
  return isValidETHAddress;
}

export function isValidETHLikeAddress(address: string, isChecksumValid: boolean): boolean {
  const isValidMixedCase = isValidMixedCaseETHAddress(address);
  const isValidUpperOrLowerCase = isValidUpperOrLowerCaseETHAddress(address);
  if (!['0x', '0X'].includes(address.substring(0, 2))) {
    // Invalid if the address doesn't begin with '0x' or '0X'
    return false;
  } else if (isValidMixedCase && !isValidUpperOrLowerCase && !isChecksumValid) {
    // Invalid if mixed case, but not checksummed.
    return false;
  } else if (isValidMixedCase && !isValidUpperOrLowerCase && isChecksumValid) {
    // Valid if isMixedCaseAddress && checksum is valid
    return true;
  } else if (isValidUpperOrLowerCase && !isValidMixedCase) {
    // Valid if isValidUpperOrLowercase eth address && checksum
    return true;
  } else if (!isValidUpperOrLowerCase && !isValidMixedCase) {
    return false;
  }
  // else return false
  return true;
}

export const isValidETHRecipientAddress = (
  address: string,
  resolutionErr: ResolutionError | undefined
) => {
  if (isValidENSName(address) && resolutionErr) {
    // Is a valid ENS name, but it couldn't be resolved or there is some other issue.
    return {
      success: false,
      name: 'ValidationError',
      type: InlineMessageType.ERROR,
      message: translateRaw('TO_FIELD_ERROR')
    };
  } else if (isValidENSName(address) && !resolutionErr) {
    // Is a valid ENS name, and it can be resolved!
    return {
      success: true
    };
  } else if (
    !isValidENSName(address) &&
    isValidMixedCaseETHAddress(address) &&
    isChecksumAddress(address)
  ) {
    // isMixedCase Address that is a valid checksum
    return { success: true };
  } else if (
    !isValidENSName(address) &&
    isValidMixedCaseETHAddress(address) &&
    !isChecksumAddress(address) &&
    isValidUpperOrLowerCaseETHAddress(address)
  ) {
    // Is a fully-uppercase or fully-lowercase address and is an invalid checksum
    return { success: true };
  } else if (
    !isValidENSName(address) &&
    isValidMixedCaseETHAddress(address) &&
    !isChecksumAddress(address) &&
    !isValidUpperOrLowerCaseETHAddress(address)
  ) {
    // Is not fully-uppercase or fully-lowercase address and is an invalid checksum
    return {
      success: false,
      name: 'ValidationError',
      type: InlineMessageType.INFO_CIRCLE,
      message: translate('CHECKSUM_ERROR')
    };
  } else if (!isValidENSName(address) && !isValidMixedCaseETHAddress(address)) {
    // Is an invalid ens name & an invalid mixed-case address.
    return {
      success: false,
      name: 'ValidationError',
      type: InlineMessageType.ERROR,
      message: translateRaw('TO_FIELD_ERROR')
    };
  }
  return { success: true };
};

export function isValidMixedCaseETHAddress(address: string) {
  return /^(0(x|X)[a-fA-F0-9]{40})$/.test(address);
}

export function isValidUpperOrLowerCaseETHAddress(address: string) {
  return /^(0(x|X)(([a-f0-9]{40})|([A-F0-9]{40})))$/.test(address);
}

export function isValidAddress(address: string, chainId: number) {
  return getIsValidAddressFunction(chainId)(address);
}

export function isValidETHAddress(address: string): boolean {
  return isValidETHLikeAddress(address, isChecksumAddress(address));
}

export const isCreationAddress = (address: string): boolean =>
  address === '0x0' || address === CREATION_ADDRESS;

export function isValidXMRAddress(address: string): boolean {
  return !!address.match(
    /4[0-9AB][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{93}/
  );
}

export function isValidHex(str: string): boolean {
  if (str === '') {
    return true;
  }
  str = str.substring(0, 2) === '0x' ? str.substring(2).toUpperCase() : str.toUpperCase();
  const re = /^[0-9A-F]*$/g; // Match 0 -> unlimited times, 0 being "0x" case
  return re.test(str);
}

export function isValidPath(dPath: string) {
  // ETC Ledger is incorrect up due to an extra ' at the end of it
  if (dPath === DPaths.ETC_LEDGER.value) {
    return true;
  }

  // SingularDTV is incorrect due to using a 0 instead of a 44 as the purpose
  if (dPath === DPaths.ETH_SINGULAR.value) {
    return true;
  }

  // Ledger Live is incorrect due to using the full path instead of a prefix and overwriting the index.
  if (dPath === DPaths.ETH_LEDGER_LIVE.value) {
    return true;
  }

  return dPathRegex.test(dPath);
}

export type TxFeeResponseType =
  | 'Warning'
  | 'Warning-Use-Lower'
  | 'Error-High-Tx-Fee'
  | 'Error-Very-High-Tx-Fee'
  | 'None'
  | 'Invalid';
interface TxFeeResponse {
  type: TxFeeResponseType;
  amount?: string;
  fee?: string;
}

export const validateTxFee = (
  amount: string,
  assetRateUSD: number,
  assetRateFiat: number,
  isERC20: boolean,
  gasLimit: string,
  gasPrice: string,
  ethAssetRate?: number
): TxFeeResponse => {
  const validInputRegex = /^[0-9]+(\.[0-9])?[0-9]*$/;
  if (
    !amount.match(validInputRegex) ||
    !gasLimit.match(validInputRegex) ||
    !gasPrice.match(validInputRegex)
  ) {
    return { type: 'Invalid' };
  }
  const DEFAULT_RATE_DECIMAL = 4;
  const DEFAULT_DECIMAL = DEFAULT_ASSET_DECIMAL + DEFAULT_RATE_DECIMAL;
  const getAssetRate = () => convertedToBaseUnit(assetRateUSD.toString(), DEFAULT_RATE_DECIMAL);
  const getAssetRateLocal = () =>
    convertedToBaseUnit(assetRateFiat.toString(), DEFAULT_RATE_DECIMAL);
  const getEthAssetRate = () =>
    ethAssetRate ? convertedToBaseUnit(assetRateUSD.toString(), DEFAULT_RATE_DECIMAL) : 0;

  const txAmount = EthersBN.from(convertedToBaseUnit(amount, DEFAULT_DECIMAL));
  const txFee = EthersBN.from(gasStringsToMaxGasBN(gasPrice, gasLimit).toString());
  const txFeeFiatValue = EthersBN.from(getAssetRate()).mul(txFee);

  const txTransactionFeeInEthFiatValue =
    ethAssetRate && ethAssetRate > 0 ? EthersBN.from(getEthAssetRate()).mul(txFee) : null;

  const createTxFeeResponse = (type: TxFeeResponseType) => {
    const txAmountFiatLocalValue = EthersBN.from(getAssetRateLocal()).mul(txAmount);
    const txFeeFiatLocalValue = EthersBN.from(getAssetRateLocal()).mul(txFee);
    return {
      type,
      amount: bigify(
        baseToConvertedUnit(
          txAmountFiatLocalValue.toString(),
          DEFAULT_DECIMAL + DEFAULT_RATE_DECIMAL
        )
      ).toFixed(4),
      fee: bigify(baseToConvertedUnit(txFeeFiatLocalValue.toString(), DEFAULT_DECIMAL)).toFixed(4)
    };
  };
  const isGreaterThanEthFraction = (ethFraction: number) => {
    if (ethAssetRate && txTransactionFeeInEthFiatValue) {
      return txTransactionFeeInEthFiatValue.gte(
        convertedToBaseUnit((ethAssetRate * ethFraction).toString(), DEFAULT_DECIMAL)
      );
    }
    return false;
  };

  // In case of fractions of amount being send
  if (txAmount.lt(EthersBN.from(convertedToBaseUnit('0.000001', DEFAULT_DECIMAL)))) {
    return createTxFeeResponse('None');
  }

  // More than 100$ OR 0.5 ETH
  if (
    txFeeFiatValue.gt(EthersBN.from(convertedToBaseUnit('100', DEFAULT_DECIMAL))) ||
    isGreaterThanEthFraction(0.5)
  ) {
    return createTxFeeResponse('Error-Very-High-Tx-Fee');
  }

  // More than 25$ OR 0.15 ETH
  if (
    txFeeFiatValue.gt(EthersBN.from(convertedToBaseUnit('25', DEFAULT_DECIMAL))) ||
    isGreaterThanEthFraction(0.15)
  ) {
    return createTxFeeResponse('Error-High-Tx-Fee');
  }

  // More than 15$ for ERC20 or 10$ for ETH
  if (
    txFeeFiatValue.gt(EthersBN.from(convertedToBaseUnit(isERC20 ? '15' : '10', DEFAULT_DECIMAL)))
  ) {
    return createTxFeeResponse('Warning-Use-Lower');
  }

  // Erc token where txFee is higher than amount
  if (!isERC20 && txAmount.lt(convertedToBaseUnit(txFee.toString(), DEFAULT_RATE_DECIMAL))) {
    return createTxFeeResponse('Warning');
  }

  return createTxFeeResponse('None');
};

export const isTransactionFeeHigh = (
  amount: string,
  assetRate: number,
  isERC20: boolean,
  gasLimit: string,
  gasPrice: string
) => {
  const validInputRegex = /^[0-9]+(\.[0-9])?[0-9]*$/;
  if (
    !amount.match(validInputRegex) ||
    !gasLimit.match(validInputRegex) ||
    !gasPrice.match(validInputRegex)
  ) {
    return false;
  }
  const amountBN = EthersBN.from(convertedToBaseUnit(amount, DEFAULT_ASSET_DECIMAL));
  if (amountBN.lt(EthersBN.from(convertedToBaseUnit('0.000001', DEFAULT_ASSET_DECIMAL)))) {
    return false;
  }
  const transactionFee = EthersBN.from(gasStringsToMaxGasBN(gasPrice, gasLimit).toString());
  const fiatValue = EthersBN.from(assetRate.toFixed(0)).mul(transactionFee);
  // For now transaction fees are too high if they are more than $10 fiat or more than the sent amount
  return (
    (!isERC20 && amountBN.lt(transactionFee)) ||
    fiatValue.gt(EthersBN.from(convertedToBaseUnit('10', DEFAULT_ASSET_DECIMAL)))
  );
};

export const gasLimitValidator = (gasLimit: BigNumber | string) => {
  const gasLimitFloat = bigify(gasLimit);
  return (
    isValidPositiveOrZeroInteger(gasLimitFloat) &&
    gasLimitFloat.gte(GAS_LIMIT_LOWER_BOUND) &&
    gasLimitFloat.lte(GAS_LIMIT_UPPER_BOUND)
  );
};

function getLength(num: number | string | BigNumber | undefined) {
  return num !== undefined ? num.toString().length : 0;
}

export const gasPriceValidator = (gasPrice: BigNumber | string): boolean => {
  const gasPriceFloat = bigify(gasPrice);
  const decimalLength: string = gasPriceFloat.toString().split('.')[1];
  return (
    isValidPositiveNumber(gasPriceFloat) &&
    gasPriceFloat.gte(GAS_PRICE_GWEI_LOWER_BOUND) &&
    gasPriceFloat.lte(GAS_PRICE_GWEI_UPPER_BOUND) &&
    getLength(gasPriceFloat) <= 10 &&
    getLength(decimalLength) <= 6
  );
};

// JSONSchema Validations for Rpc responses
const v = new Validator();

export const schema = {
  RpcNode: {
    type: 'object',
    additionalProperties: true,
    properties: {
      jsonrpc: { type: 'string' },
      id: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
      result: {
        oneOf: [{ type: 'string' }, { type: 'array' }, { type: 'object' }]
      },
      status: { type: 'string' },
      message: { type: 'string', maxLength: 2 }
    }
  }
};

function isValidResult(response: JsonRPCResponse, schemaFormat: typeof schema.RpcNode): boolean {
  return v.validate(response, schemaFormat).valid;
}

function formatErrors(response: JsonRPCResponse, apiType: string) {
  if (response.error) {
    // Metamask errors are sometimes full-blown stacktraces, no bueno. Instead,
    // We'll just take the first line of it, and the last thing after all of
    // the colons. An example error message would be:
    // "Error: Metamask Sign Tx Error: User rejected the signature."
    const lines = response.error.message.split('\n');
    if (lines.length > 2) {
      return lines[0].split(':').pop();
    } else {
      return `${response.error.message} ${response.error.data || ''}`;
    }
  }
  return `Invalid ${apiType} Error`;
}

enum API_NAME {
  Sign_Message = 'Sign Message',
  Get_Accounts = 'Get Accounts',
  Request_Permissions = 'Request_Permissions',
  Get_Permissions = 'Get_Permissions',
  Get_ChainId = 'Get_ChainId'
}

const isValidEthServiceResponse = (
  response: JsonRPCResponse,
  schemaType: typeof schema.RpcNode
) => (apiName: API_NAME, cb?: (res: JsonRPCResponse) => any) => {
  if (!isValidResult(response, schemaType)) {
    if (cb) {
      return cb(response);
    }
    throw new Error(formatErrors(response, apiName));
  }
  return response;
};

export const isValidSignMessage = (response: JsonRPCResponse) =>
  isValidEthServiceResponse(response, schema.RpcNode)(API_NAME.Sign_Message);

export const isValidGetAccounts = (response: JsonRPCResponse) =>
  isValidEthServiceResponse(response, schema.RpcNode)(API_NAME.Get_Accounts);

export const isValidGetChainId = (response: JsonRPCResponse) =>
  isValidEthServiceResponse(response, schema.RpcNode)(API_NAME.Get_ChainId);

export const isValidRequestPermissions = (response: Web3RequestPermissionsResponse) =>
  isValidEthServiceResponse(
    (response as unknown) as JsonRPCResponse,
    schema.RpcNode
  )(API_NAME.Request_Permissions) as Web3RequestPermissionsResponse;

export const isValidGetPermissions = (response: JsonRPCResponse) =>
  isValidEthServiceResponse(
    response,
    schema.RpcNode
  )(API_NAME.Get_Permissions) as Web3RequestPermissionsResponse;

export const isValidTxHash = (hash: string) =>
  hash.substring(0, 2) === '0x' && hash.length === 66 && isValidHex(hash);

export const isENSLabelHash = (stringToTest: string) => /\[[a-fA-F0-9]{64}\]/.test(stringToTest);
