import { IFormikFields } from '@types';

export type SendFormCallbackType = () => { isValid: boolean; values: IFormikFields | null };

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
