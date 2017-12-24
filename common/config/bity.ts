import { BTCTxExplorer, ETHTxExplorer } from './data';

export type WhitelistedCoins = 'BTC' | 'REP' | 'ETH';
const serverURL = 'https://bity.myetherapi.com';
const bityURL = 'https://bity.com/api';
const BTCMin = 0.01;
const BTCMax = 3;

// while Bity is supposedly OK with any order that is at least 0.01 BTC Worth, the order will fail if you send 0.01 BTC worth of ETH.
// This is a bad magic number, but will suffice for now
// value = percent higher/lower than 0.01 BTC worth
const buffers = {
  ETH: 0.1,
  REP: 0.2
};

// rate must be BTC[KIND]
export function generateKindMin(BTCKINDRate: number, kind: keyof typeof buffers): number {
  const kindMinVal = BTCKINDRate * BTCMin;
  return kindMinVal + kindMinVal * buffers[kind];
}

// rate must be BTC[KIND]
export function generateKindMax(BTCKINDRate: number, kind: keyof typeof buffers): number {
  const kindMax = BTCKINDRate * BTCMax;
  return kindMax - kindMax * buffers[kind];
}

const info = {
  serverURL,
  bityURL,
  ETHTxExplorer,
  BTCTxExplorer,
  BTCMin,
  BTCMax,
  validStatus: ['RCVE', 'FILL', 'CONF', 'EXEC'],
  invalidStatus: ['CANC'],
  postConfig: {
    headers: {
      'Content-Type': 'application/json; charset:UTF-8'
    }
  }
};

export default info;
