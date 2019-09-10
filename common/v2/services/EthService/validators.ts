import { toChecksumAddress, isValidPrivate } from 'ethereumjs-util';
import { isValidChecksumAddress as isValidChecksumRSKAddress } from 'rskjs-util';
import WalletAddressValidator from 'wallet-address-validator';
import { Validator } from 'jsonschema';

import {
  dPathRegex,
  DPaths,
  GAS_LIMIT_LOWER_BOUND,
  GAS_LIMIT_UPPER_BOUND,
  GAS_PRICE_GWEI_LOWER_BOUND,
  GAS_PRICE_GWEI_UPPER_BOUND
} from 'v2/config';
import { JsonRPCResponse } from 'v2/types';
import { stripHexPrefix } from './utils';

export const isValidNumber = (value: number | string) => {
  if (typeof value === 'string') {
    return isFinite(Number(value)) && Number(value) >= 0;
  }
  return isFinite(value) && value >= 0;
};

function isChecksumAddress(address: string): boolean {
  return address === toChecksumAddress(address);
}

function isValidRSKAddress(address: string, chainId: number): boolean {
  return isValidETHLikeAddress(address, () => isValidChecksumRSKAddress(address, chainId));
}

function getIsValidAddressFunction(chainId: number) {
  if (chainId === 30 || chainId === 31) {
    return (address: string) => isValidRSKAddress(address, chainId);
  }
  return isValidETHAddress;
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

export function isValidAddress(address: string, chainId: number) {
  return getIsValidAddressFunction(chainId)(address);
}

export function isValidETHAddress(address: string): boolean {
  return isValidETHLikeAddress(address, () => isChecksumAddress(address));
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

export const gasLimitValidator = (gasLimit: number | string) => {
  const gasLimitFloat = typeof gasLimit === 'string' ? Number(gasLimit) : gasLimit;
  return (
    isValidNumber(gasLimitFloat) &&
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
    isValidNumber(gasPriceFloat) &&
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
