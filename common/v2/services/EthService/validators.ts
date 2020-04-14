import { toChecksumAddress, isValidPrivate } from 'ethereumjs-util';
import { isValidChecksumAddress as isValidChecksumRSKAddress } from 'rskjs-util';
import WalletAddressValidator from 'wallet-address-validator';
import { Validator } from 'jsonschema';
import { ResolutionError } from '@unstoppabledomains/resolution';

import {
  dPathRegex,
  DPathsList as DPaths,
  GAS_LIMIT_LOWER_BOUND,
  GAS_LIMIT_UPPER_BOUND,
  GAS_PRICE_GWEI_LOWER_BOUND,
  GAS_PRICE_GWEI_UPPER_BOUND,
  CREATION_ADDRESS,
  DEFAULT_ASSET_DECIMAL
} from 'v2/config';
import { JsonRPCResponse, InlineMessageType } from 'v2/types';
import translate from 'v2/translations';

import { stripHexPrefix, gasStringsToMaxGasBN, convertedToBaseUnit } from './utils';
import { bigNumberify } from 'ethers/utils';
import { isValidENSName } from './ens/validators';

export const isValidPositiveOrZeroInteger = (value: number | string) =>
  isValidPositiveNumber(value) && isInteger(value);

export const isValidNonZeroInteger = (value: number | string) =>
  isValidPositiveOrZeroInteger(value) && isPositiveNonZeroNumber(value);

export const isValidPositiveNumber = (value: number | string) =>
  isFinite(Number(value)) && Number(value) >= 0;

const isPositiveNonZeroNumber = (value: number | string) => Number(value) > 0;

const isInteger = (value: number | string) =>
  Number.isInteger(typeof value === 'string' ? Number(value) : value);

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
      message: translate('TO_FIELD_ERROR')
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
      message: translate('TO_FIELD_ERROR')
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

export function isValidBTCAddress(address: string): boolean {
  return WalletAddressValidator.validate(address, 'BTC');
}

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

export function isValidPrivKey(privkey: string | Buffer): boolean {
  if (typeof privkey === 'string') {
    const strippedKey = stripHexPrefix(privkey);
    const initialCheck = strippedKey.length === 64;
    if (initialCheck) {
      const keyBuffer = Buffer.from(strippedKey, 'hex');
      return isValidPrivate(keyBuffer);
    }
    return false;
  } else if (privkey instanceof Buffer) {
    return privkey.length === 32 && isValidPrivate(privkey);
  } else {
    return false;
  }
}

export function isValidEncryptedPrivKey(privkey: string): boolean {
  if (typeof privkey === 'string') {
    return privkey.length === 128 || privkey.length === 132;
  } else {
    return false;
  }
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

  return dPathRegex.test(dPath);
}

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
  const amountBN = bigNumberify(convertedToBaseUnit(amount, DEFAULT_ASSET_DECIMAL));
  if (amountBN.lt(bigNumberify(convertedToBaseUnit('0.000001', DEFAULT_ASSET_DECIMAL)))) {
    return false;
  }
  const transactionFee = bigNumberify(gasStringsToMaxGasBN(gasPrice, gasLimit).toString());
  const fiatValue = bigNumberify(assetRate.toFixed(0)).mul(transactionFee);
  // For now transaction fees are too high if they are more than $10 fiat or more than the sent amount
  return (
    (!isERC20 && amountBN.lt(transactionFee)) ||
    fiatValue.gt(bigNumberify(convertedToBaseUnit('10', DEFAULT_ASSET_DECIMAL)))
  );
};

export const gasLimitValidator = (gasLimit: number | string) => {
  const gasLimitFloat = Number(gasLimit);
  return (
    isValidPositiveOrZeroInteger(gasLimitFloat) &&
    gasLimitFloat >= GAS_LIMIT_LOWER_BOUND &&
    gasLimitFloat <= GAS_LIMIT_UPPER_BOUND
  );
};

function getLength(num: number) {
  return num.toString().length;
}

export const gasPriceValidator = (gasPrice: number | string): boolean => {
  const gasPriceFloat: number = typeof gasPrice === 'string' ? Number(gasPrice) : gasPrice;
  const decimalLength: string = gasPriceFloat.toString().split('.')[1];
  return (
    isValidPositiveNumber(gasPriceFloat) &&
    gasPriceFloat >= GAS_PRICE_GWEI_LOWER_BOUND &&
    gasPriceFloat <= GAS_PRICE_GWEI_UPPER_BOUND &&
    getLength(gasPriceFloat) <= 10 &&
    getLength(Number(decimalLength)) <= 6
  );
};

// JSONSchema Validations for Rpc responses
const v = new Validator();

export const schema = {
  RpcNode: {
    type: 'object',
    additionalProperties: false,
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
  Get_Balance = 'Get Balance',
  Estimate_Gas = 'Estimate Gas',
  Call_Request = 'Call Request',
  Token_Balance = 'Token Balance',
  Transaction_Count = 'Transaction Count',
  Current_Block = 'Current Block',
  Raw_Tx = 'Raw Tx',
  Send_Transaction = 'Send Transaction',
  Sign_Message = 'Sign Message',
  Get_Accounts = 'Get Accounts',
  Net_Version = 'Net Version',
  Transaction_By_Hash = 'Transaction By Hash',
  Transaction_Receipt = 'Transaction Receipt'
}

const isValidEthCall = (response: JsonRPCResponse, schemaType: typeof schema.RpcNode) => (
  apiName: API_NAME,
  cb?: (res: JsonRPCResponse) => any
) => {
  if (!isValidResult(response, schemaType)) {
    if (cb) {
      return cb(response);
    }
    throw new Error(formatErrors(response, apiName));
  }
  return response;
};

export const isValidGetBalance = (response: JsonRPCResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Get_Balance);

export const isValidEstimateGas = (response: JsonRPCResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Estimate_Gas);

export const isValidCallRequest = (response: JsonRPCResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Call_Request);

export const isValidTokenBalance = (response: JsonRPCResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Token_Balance, () => ({
    result: 'Failed'
  }));

export const isValidTransactionCount = (response: JsonRPCResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Transaction_Count);

export const isValidTransactionByHash = (response: JsonRPCResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Transaction_By_Hash);

export const isValidTransactionReceipt = (response: JsonRPCResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Transaction_Receipt);

export const isValidCurrentBlock = (response: JsonRPCResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Current_Block);

export const isValidRawTxApi = (response: JsonRPCResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Raw_Tx);

export const isValidSendTransaction = (response: JsonRPCResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Send_Transaction);

export const isValidSignMessage = (response: JsonRPCResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Sign_Message);

export const isValidGetAccounts = (response: JsonRPCResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Get_Accounts);

export const isValidGetNetVersion = (response: JsonRPCResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Net_Version);

export const isValidTxHash = (hash: string) =>
  hash.substring(0, 2) === '0x' && hash.length === 66 && isValidHex(hash);
