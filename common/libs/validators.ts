import { toChecksumAddress } from 'ethereumjs-util';
import { RawTransaction } from 'libs/transaction';
import WalletAddressValidator from 'wallet-address-validator';
import { normalise } from './ens';

export function isValidETHAddress(address: string): boolean {
  if (!address) {
    return false;
  }
  if (address === '0x0000000000000000000000000000000000000000') {
    return false;
  }
  return validateEtherAddress(address);
}

export function isValidBTCAddress(address: string): boolean {
  return WalletAddressValidator.validate(address, 'BTC');
}

export function isValidHex(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }
  if (str === '') {
    return true;
  }
  str =
    str.substring(0, 2) === '0x'
      ? str.substring(2).toUpperCase()
      : str.toUpperCase();
  const re = /^[0-9A-F]*$/g; // Match 0 -> unlimited times, 0 being "0x" case
  return re.test(str);
}

export function isValidENSorEtherAddress(address: string): boolean {
  return isValidETHAddress(address) || isValidENSAddress(address);
}

export function isValidENSName(str: string) {
  try {
    return (
      str.length > 6 && normalise(str) !== '' && str.substring(0, 2) !== '0x'
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
    if (validTLDs[tld]) {
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

// FIXME we probably want to do checksum checks sideways
function validateEtherAddress(address: string): boolean {
  if (address.substring(0, 2) !== '0x') {
    return false;
  } else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    return false;
  } else if (
    /^(0x)?[0-9a-f]{40}$/.test(address) ||
    /^(0x)?[0-9A-F]{40}$/.test(address)
  ) {
    return true;
  } else {
    return isChecksumAddress(address);
  }
}

export function isValidPrivKey(privkey: string | Buffer): boolean {
  if (typeof privkey === 'string') {
    return privkey.length === 64;
  } else if (privkey instanceof Buffer) {
    return privkey.length === 32;
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

export function isPositiveIntegerOrZero(num: number): boolean {
  if (isNaN(num) || !isFinite(num)) {
    return false;
  }
  return num >= 0 && parseInt(num.toString(), 10) === num;
}

export function isValidRawTx(rawTx: RawTransaction): boolean {
  const propReqs = [
    { name: 'nonce', type: 'string', lenReq: true },
    { name: 'gasPrice', type: 'string', lenReq: true },
    { name: 'gasLimit', type: 'string', lenReq: true },
    { name: 'to', type: 'string', lenReq: true },
    { name: 'value', type: 'string', lenReq: true },
    { name: 'data', type: 'string', lenReq: false },
    { name: 'chainId', type: 'number', lenReq: false }
  ];

  // ensure rawTx has above properties
  // ensure all specified types match
  // ensure length !0 for strings where length is required
  // ensure valid hex for strings
  // ensure all strings begin with '0x'
  // ensure valid address for 'to' prop
  // ensure rawTx only has above properties

  for (const prop of propReqs) {
    const value = rawTx[prop.name];

    if (!rawTx.hasOwnProperty(prop.name)) {
      return false;
    }
    if (typeof value !== prop.type) {
      return false;
    }
    if (prop.type === 'string') {
      if (prop.lenReq && value.length === 0) {
        return false;
      }
      if (value.length && value.substring(0, 2) !== '0x') {
        return false;
      }
      if (!isValidHex(value)) {
        return false;
      }
    }
  }

  if (Object.keys(rawTx).length !== propReqs.length) {
    return false;
  }

  return true;
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

export const isValidGasPrice = (gasLimit: string) =>
  !!(gasLimit && isFinite(parseFloat(gasLimit)) && parseFloat(gasLimit) > 0);

export const isValidByteCode = (byteCode: string) =>
  byteCode && byteCode.length > 0 && byteCode.length % 2 === 0;

export const isValidAbiJson = (abiJson: string) =>
  abiJson && abiJson.startsWith('[') && abiJson.endsWith(']');
