import * as crypto from 'crypto';
import getUuid from 'uuid-by-string';
import { toChecksumAddress } from 'ethereumjs-util';
import { TUuid, NetworkId } from 'v2/types';

// TODO: If used for anything other than generating public ids, look up a more-secure way to do this.
export const generateUUID = (): TUuid => {
  const hexstring = crypto.randomBytes(16).toString('hex');
  const uuid =
    hexstring.substring(0, 8) +
    '-' +
    hexstring.substring(8, 12) +
    '-' +
    hexstring.substring(12, 16) +
    '-' +
    hexstring.substring(16, 20) +
    '-' +
    hexstring.substring(20);
  return uuid as TUuid;
};

const generateUUIDByIdAndAddress = (id: string, address?: string) =>
  address ? (getUuid(`${id}-${toChecksumAddress(address)}`) as TUuid) : (getUuid(`${id}`) as TUuid);

export const generateAssetUUID = (chainId: string | number, address?: string): TUuid =>
  generateUUIDByIdAndAddress(chainId.toString(), address);

export const generateContractUUID = (id: NetworkId, address: string) =>
  generateUUIDByIdAndAddress(id, address);

export const generateAccountUUID = (id: NetworkId, address: string) =>
  generateUUIDByIdAndAddress(id, address);

export const getUUID = (val: string): TUuid => getUuid(val) as TUuid;
