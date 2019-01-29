import qs from 'query-string';
import has from 'lodash/has';
import EthTx from 'ethereumjs-tx';
import { BlockExplorerConfig } from 'types/network';

interface IObjectValue {
  [key: string]: any;
}

export function objectContainsObjectKeys(
  checkingObject: IObjectValue,
  containingObject: IObjectValue
) {
  const checkingObjectKeys = Object.keys(checkingObject);
  const containsAll = checkingObjectKeys.map(key => has(containingObject, key));
  return containsAll.every(isTrue => isTrue);
}

export function getKeyByValue(object: IObjectValue, value: any) {
  return Object.keys(object).find(key => object[key] === value);
}

export function getParam(query: { [key: string]: string }, key: string) {
  const keys = Object.keys(query);
  const index = keys.findIndex(k => k.toLowerCase() === key.toLowerCase());
  if (index === -1) {
    return null;
  }
  return query[keys[index]];
}

export function getParamFromURL(url: string, param: string): string | undefined {
  return qs.parse(qs.extract(url))[param];
}

export function isAdvancedQueryTransaction(query: string): boolean {
  const params = qs.parse(query.toLowerCase());
  if ('data' in params || 'gaslimit' in params) {
    return true;
  } else {
    return false;
  }
}

export function isPositiveInteger(n: number) {
  return Number.isInteger(n) && n > 0;
}

export const getValues = (...args: any[]) =>
  args.reduce((acc, currArg) => [...acc, ...Object.values(currArg)], []);

export function transactionToRLP(tx: EthTx): string {
  const { v, r, s } = tx;

  // Poor man's serialize without signature.
  tx.v = Buffer.from([tx._chainId]);
  tx.r = Buffer.from([0]);
  tx.s = Buffer.from([0]);

  const rlp = '0x' + tx.serialize().toString('hex');

  // Restore previous values
  tx.v = v;
  tx.r = r;
  tx.s = s;

  return rlp;
}

export function signTransactionWithSignature(tx: EthTx, signature: string): Buffer {
  const sigBuf = Buffer.from(signature.substr(2), 'hex');

  // Mimicking the way tx.sign() works
  let v = sigBuf[64] + 27;

  if (tx._chainId > 0) {
    v += tx._chainId * 2 + 8;
  }

  tx.r = sigBuf.slice(0, 32);
  tx.s = sigBuf.slice(32, 64);
  tx.v = Buffer.from([v]);

  return tx.serialize();
}

interface ExplorerConfig {
  name: string;
  origin: string;
  txPath?: string;
  addressPath?: string;
  blockPath?: string;
}

export function makeExplorer(expConfig: ExplorerConfig): BlockExplorerConfig {
  const config: ExplorerConfig = {
    // Defaults
    txPath: 'tx',
    addressPath: 'address',
    blockPath: 'block',
    ...expConfig
  };

  return {
    name: config.name,
    origin: config.origin,
    txUrl: hash => `${config.origin}/${config.txPath}/${hash}`,
    addressUrl: address => `${config.origin}/${config.addressPath}/${address}`,
    blockUrl: blockNum => `${config.origin}/${config.blockPath}/${blockNum}`
  };
}
