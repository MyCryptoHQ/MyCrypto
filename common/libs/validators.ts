import { toChecksumAddress, isValidPrivate } from 'ethereumjs-util';
import { stripHexPrefix } from 'libs/values';
import WalletAddressValidator from 'wallet-address-validator';
import { normalise } from './ens';
import { Validator } from 'jsonschema';
import { JsonRpcResponse } from './nodes/rpc/types';
import { isPositiveInteger } from 'utils/helpers';
import {
  GAS_LIMIT_LOWER_BOUND,
  GAS_LIMIT_UPPER_BOUND,
  GAS_PRICE_GWEI_LOWER_BOUND,
  GAS_PRICE_GWEI_UPPER_BOUND
} from 'config/constants';

// FIXME we probably want to do checksum checks sideways
export function isValidETHAddress(address: string): boolean {
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
    return isChecksumAddress(address);
  }
}

export const isCreationAddress = (address: string): boolean =>
  address === '0x0' || address === '0x0000000000000000000000000000000000000000';

export function isValidBTCAddress(address: string): boolean {
  return WalletAddressValidator.validate(address, 'BTC');
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
    return str.length > 6 && normalise(str) !== '' && str.substring(0, 2) !== '0x';
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

export const validNumber = (num: number) => isFinite(num) && num > 0;

export const validDecimal = (input: string, decimal: number) => {
  const arr = input.split('.');
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

// Full length deterministic wallet paths from BIP44
// https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
// normal path length is 4, ledger is the exception at 3
export function isValidPath(dPath: string) {
  // TODO: use a regex to detect proper paths
  const len = dPath.split("'/").length;
  return len === 3 || len === 4;
}

export const isValidValue = (value: string) =>
  !!(value && isFinite(parseFloat(value)) && parseFloat(value) >= 0);

export const gasLimitValidator = (gasLimit: number | string) => {
  const gasLimitFloat = typeof gasLimit === 'string' ? parseFloat(gasLimit) : gasLimit;
  return (
    validNumber(gasLimitFloat) &&
    gasLimitFloat >= GAS_LIMIT_LOWER_BOUND &&
    gasLimitFloat <= GAS_LIMIT_UPPER_BOUND
  );
};

export const gasPriceValidator = (gasPrice: number | string): boolean => {
  const gasPriceFloat = typeof gasPrice === 'string' ? parseFloat(gasPrice) : gasPrice;
  return (
    validNumber(gasPriceFloat) &&
    gasPriceFloat >= GAS_PRICE_GWEI_LOWER_BOUND &&
    gasPriceFloat <= GAS_PRICE_GWEI_UPPER_BOUND
  );
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

function isValidResult(response: JsonRpcResponse, schemaFormat): boolean {
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

const isValidEthCall = (response: JsonRpcResponse, schemaType: typeof schema.RpcNode) => (
  apiName,
  cb?
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
  isValidEthCall(response, schema.RpcNode)('Get Balance');

export const isValidEstimateGas = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)('Estimate Gas');

export const isValidCallRequest = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)('Call Request');

export const isValidTokenBalance = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)('Token Balance', () => ({
    result: 'Failed'
  }));

export const isValidTransactionCount = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)('Transaction Count');

export const isValidTransactionByHash = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)('Transaction By Hash');

export const isValidTransactionReceipt = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)('Transaction Receipt');

export const isValidCurrentBlock = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)('Current Block');

export const isValidRawTxApi = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)('Raw Tx');

export const isValidSendTransaction = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)('Send Transaction');

export const isValidSignMessage = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)('Sign Message');

export const isValidGetAccounts = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)('Get Accounts');

export const isValidGetNetVersion = (response: JsonRpcResponse) =>
  isValidEthCall(response, schema.RpcNode)('Net Version');

export const isValidTxHash = (hash: string) =>
  hash.substring(0, 2) === '0x' && hash.length === 66 && isValidHex(hash);
