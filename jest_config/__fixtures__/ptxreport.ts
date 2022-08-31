import { NansenReportType, PTXReport } from '@features/ProtectTransaction';
import { TAddress } from '@types';

import { fAssets } from './assets';

const asset = fAssets[0];

export const unknownReport: PTXReport = {
  asset,
  address: '0x88F7B1E26c3A52CA3cD8aF4ba1b448391eb31d88' as TAddress,
  labels: [],
  status: NansenReportType.UNKNOWN,
  balance: '3.281665',
  lastTransaction: { ticker: 'ETH', value: '5.300000', timestamp: '06/17/2020' }
};

export const scamReport: PTXReport = {
  ...unknownReport,
  address: '0x820C415a17Bf165a174e6B55232D956202d9470f' as TAddress,
  labels: ['Scam'],
  status: NansenReportType.MALICIOUS
};

export const verifiedReport: PTXReport = {
  ...unknownReport,
  address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress,
  labels: ['MyCrypto: Donate'],
  status: NansenReportType.WHITELISTED
};

export const loadingReport: PTXReport = {
  ...unknownReport,
  address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress,
  labels: null,
  status: null
};
