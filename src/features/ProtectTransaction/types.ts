import { Asset, TAddress } from '@types';

export enum ProtectTxError {
  NO_ERROR,
  INSUFFICIENT_DATA,
  LESS_THAN_MIN_AMOUNT,
  ETH_ONLY
}

export enum NansenReportType {
  UNKNOWN,
  MALICIOUS,
  WHITELISTED
}

export interface PTXReport {
  address: TAddress;
  asset: Asset;
  balance: string | null;
  labels: string[] | null;
  status: NansenReportType | null;
  lastTransaction: { ticker: string; value: string; timestamp: string } | null;
}
