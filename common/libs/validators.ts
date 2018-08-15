import { toChecksumAddress, isValidPrivate } from 'ethereumjs-util';
import { isValidChecksumAddress as isValidChecksumRSKAddress } from 'rskjs-util';
import WalletAddressValidator from 'wallet-address-validator';
import { Validator } from 'jsonschema';
import BN from 'bn.js';

import { dPathRegex, ETC_LEDGER, ETH_SINGULAR } from 'config/dpaths';
import { translateRaw } from 'translations';
import { stripHexPrefix } from 'libs/formatters';
import { isPositiveInteger } from 'utils/helpers';
import {
  GAS_LIMIT_LOWER_BOUND,
  GAS_LIMIT_UPPER_BOUND,
  GAS_PRICE_GWEI_LOWER_BOUND,
  GAS_PRICE_GWEI_UPPER_BOUND
} from 'config/constants';
import { JsonRpcResponse } from './nodes/rpc/types';
import { normalise } from './ens';
import { EAC_SCHEDULING_CONFIG } from './scheduling';

export function getIsValidAddressFunction(chainId: number) {
  if (chainId === 30 || chainId === 31) {
    return (address: string) => isValidRSKAddress(address, chainId);
  }
  return isValidETHAddress;
}

export function isValidAddress(address: string, chainId: number) {
  return getIsValidAddressFunction(chainId)(address);
}

function isValidETHLikeAddress(address: string, extraChecks?: () => boolean): boolean {
  if (address === '0x0000000000000000000000000000000000000000') {
    return false;
  }
  if (address.substring(0, 2) !== '0x') {
    return false;
  } else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    return false;
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
    return true;
  } else {
    return extraChecks ? extraChecks() : false;
  }
}

export function isValidETHAddress(address: string): boolean {
  return isValidETHLikeAddress(address, () => isChecksumAddress(address));
}

export function isValidRSKAddress(address: string, chainId: number): boolean {
  return isValidETHLikeAddress(address, () => isValidChecksumRSKAddress(address, chainId));
}

export const isCreationAddress = (address: string): boolean =>
  address === '0x0' || address === '0x0000000000000000000000000000000000000000';

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

export function isValidENSorEtherAddress(address: string): boolean {
  return isValidETHAddress(address) || isValidENSAddress(address);
}

export function isValidENSName(str: string) {
  try {
    return (
      str.length > 6 && !str.includes('.') && normalise(str) !== '' && str.substring(0, 2) !== '0x'
    );
  } catch (e) {
    return false;
  }
}

export function isValidENSAddress(address: string): boolean {
  try {
    const normalized = normalise(address);
    const tld = normalized.substr(normalized.lastIndexOf('.') + 1);
    const validTLDs = {
      eth: true,
      test: true,
      reverse: true
    };
    if (validTLDs[tld as keyof typeof validTLDs]) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

function isChecksumAddress(address: string): boolean {
  return address === toChecksumAddress(address);
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

export const validNumber = (num: number) => isFinite(num) && num >= 0;
export const validPositiveNumber = (num: number) => validNumber(num) && num !== 0;

export const validDecimal = (input: string, decimal: number) => {
  const arr = input.split('.');

  // Only a single decimal can exist.
  if (arr.length > 2) {
    return false;
  }

  const fractionPortion = arr[1];

  if (!fractionPortion || fractionPortion.length === 0) {
    return true;
  }

  const decimalLength = fractionPortion.length;

  return decimalLength <= decimal;
};

export function isPositiveIntegerOrZero(num: number): boolean {
  if (isNaN(num) || !isFinite(num)) {
    return false;
  }
  return num >= 0 && parseInt(num.toString(), 10) === num;
}

export function isValidPath(dPath: string) {
  // ETC Ledger is incorrect up due to an extra ' at the end of it
  if (dPath === ETC_LEDGER.value) {
    return true;
  }

  // SingularDTV is incorrect due to using a 0 instead of a 44 as the purpose
  if (dPath === ETH_SINGULAR.value) {
    return true;
  }

  return dPathRegex.test(dPath);
}

export const isValidValue = (value: string) =>
  !!(value && isFinite(Number(value)) && Number(value) >= 0);

export const gasLimitValidator = (gasLimit: number | string) => {
  const gasLimitFloat = typeof gasLimit === 'string' ? Number(gasLimit) : gasLimit;
  return (
    validNumber(gasLimitFloat) &&
    gasLimitFloat >= GAS_LIMIT_LOWER_BOUND &&
    gasLimitFloat <= GAS_LIMIT_UPPER_BOUND
  );
};

export const gasPriceValidator = (gasPrice: number | string): boolean => {
  const gasPriceFloat = typeof gasPrice === 'string' ? Number(gasPrice) : gasPrice;
  return (
    validNumber(gasPriceFloat) &&
    gasPriceFloat >= GAS_PRICE_GWEI_LOWER_BOUND &&
    gasPriceFloat <= GAS_PRICE_GWEI_UPPER_BOUND
  );
};

export const timeBountyValidator = (timeBounty: BN | number | string | null): boolean => {
  if (!timeBounty) {
    return false;
  }

  if (timeBounty instanceof BN) {
    return (
      timeBounty.gte(EAC_SCHEDULING_CONFIG.TIME_BOUNTY_MIN) &&
      timeBounty.lte(EAC_SCHEDULING_CONFIG.TIME_BOUNTY_MAX)
    );
  }

  const timeBountyFloat = typeof timeBounty === 'string' ? Number(timeBounty) : timeBounty;

  return validNumber(timeBountyFloat);
};

export const isValidByteCode = (byteCode: string) =>
  byteCode && byteCode.length > 0 && byteCode.length % 2 === 0;

export const isValidAbiJson = (abiJson: string) =>
  abiJson && abiJson.startsWith('[') && abiJson.endsWith(']');

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

export const isValidNonce = (value: string): boolean => {
  let valid;
  if (value === '0') {
    valid = true;
  } else if (!value) {
    valid = false;
  } else {
    valid = isPositiveInteger(+value);
  }
  return valid;
};

function isValidResult(response: JsonRpcResponse, schemaFormat: typeof schema.RpcNode): boolean {
  return v.validate(response, schemaFormat).valid;
}

function formatErrors(response: JsonRpcResponse, apiType: string) {
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

const isValidEthCall = (response: JsonRpcResponse, schemaType: typeof schema.RpcNode) => (
  apiName: API_NAME,
  cb?: (res: JsonRpcResponse) => any
) => {
  if (!isValidResult(response, schemaType)) {
    if (cb) {
      return cb(response);
    }
    throw new Error(formatErrors(response, apiName));
  }
  return response;
};

export const isValidGetBalance = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Get_Balance);

export const isValidEstimateGas = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Estimate_Gas);

export const isValidCallRequest = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Call_Request);

export const isValidTokenBalance = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Token_Balance, () => ({
    result: 'Failed'
  }));

export const isValidTransactionCount = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Transaction_Count);

export const isValidTransactionByHash = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Transaction_By_Hash);

export const isValidTransactionReceipt = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Transaction_Receipt);

export const isValidCurrentBlock = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Current_Block);

export const isValidRawTxApi = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Raw_Tx);

export const isValidSendTransaction = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Send_Transaction);

export const isValidSignMessage = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Sign_Message);

export const isValidGetAccounts = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Get_Accounts);

export const isValidGetNetVersion = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)(API_NAME.Net_Version);
export const isValidTxHash = (hash: string) =>
  hash.substring(0, 2) === '0x' && hash.length === 66 && isValidHex(hash);

export function isValidLabelLength(label: string, options: { allowEmpty?: boolean } = {}): boolean {
  const meetsMinimumLengthRequirement = label.length >= 2;
  const meetsMaximumLengthRequirement = label.length <= 50;
  const labelOnlyContainsSpaces = !label.trim();

  if (options.allowEmpty && label.length === 0) {
    return true;
  }

  if (!options.allowEmpty && labelOnlyContainsSpaces) {
    return false;
  }

  return meetsMinimumLengthRequirement && meetsMaximumLengthRequirement;
}

export function isLabelWithoutENS(label: string): boolean {
  const ensTlds = ['.eth', '.test', '.reverse'];

  for (const tld of ensTlds) {
    if (label.includes(tld)) {
      return false;
    }
  }

  return true;
}

export function isValidAddressLabel(
  address: string,
  label: string,
  addresses: { [address: string]: string },
  labels: { [label: string]: string },
  chainId: number
) {
  const addressAlreadyExists = !!addresses[address.toLowerCase()];
  const labelAlreadyExists = !!labels[label];
  const result: { isValid: boolean; addressError?: string; labelError?: string } = {
    isValid: true
  };

  if (!isValidAddress(address, chainId)) {
    result.addressError = translateRaw('INVALID_ADDRESS');
  }

  if (addressAlreadyExists) {
    result.addressError = translateRaw('ADDRESS_ALREADY_EXISTS');
  }

  if (!isValidLabelLength(label)) {
    result.labelError = translateRaw('INVALID_LABEL_LENGTH');
  }

  if (!isLabelWithoutENS(label)) {
    result.labelError = translateRaw('LABEL_CANNOT_CONTAIN_ENS_SUFFIX');
  }

  if (labelAlreadyExists) {
    result.labelError = translateRaw('LABEL_ALREADY_EXISTS');
  }

  if (result.addressError || result.labelError) {
    result.isValid = false;
  }

  return result;
}
