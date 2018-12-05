import { DepositStatuses, SendAmountResponse } from 'v2/services';
import { SHAPESHIFT_SUPPORT_EMAILS } from './constants';
import { AssetOption } from './types';

export const getSecondsRemaining = (expiration: number): number => {
  const secondsRemaining = Math.floor((+new Date(expiration) - Date.now()) / 1000);

  return secondsRemaining;
};

export const getTimeRemaining = (expiration: number): string => {
  const secondsRemaining = getSecondsRemaining(expiration);
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining - minutes * 60;
  const minutesSide = minutes < 10 ? `0${minutes}` : minutes;
  const secondsSide = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutesSide}:${secondsSide}`;
};

export const getStatusWording = (status: DepositStatuses): string => {
  switch (status) {
    case DepositStatuses.error:
      return 'There was an error with this ShapeShift transaction';
    case DepositStatuses.out_of_time:
      return 'The time has run out for this transaction';
    case DepositStatuses.no_deposits:
      return 'Waiting on deposit';
    case DepositStatuses.received:
      return 'Deposit received';
    case DepositStatuses.complete:
      return 'Transaction complete';
    default:
      return '';
  }
};

export const buildAssets = (options: string[], images: any = {}): AssetOption[] =>
  options.map(option => ({
    logo: images != null ? images[option] : '',
    ticker: option,
    name: ''
  }));

export const assetContainsFilter = (filter: string, asset: AssetOption): boolean => {
  const actualFilter = filter.toLowerCase();
  const tickerMatches = asset.ticker.toLowerCase().includes(actualFilter);
  const nameMatches = asset.name.toLowerCase().includes(actualFilter);

  return tickerMatches || nameMatches;
};

export const formatShapeShiftSupportEmail = (
  transaction: SendAmountResponse
): { subject: string; body: string; fallbackBody: string } => {
  const {
    orderId,
    depositAmount,
    withdrawalAmount,
    deposit,
    withdrawal,
    pair,
    quotedRate
  } = transaction;
  const [depositAsset, withdrawalAsset] = pair.toUpperCase().split('_');
  const pertinentInformation = `Provider: ShapeShift
Reference #: ${orderId}
Amount to send: ${depositAmount}
Amount to receive: ${withdrawalAmount}
Payment address: ${deposit}
Receiving address: ${withdrawal}
Rate: ${quotedRate} ${withdrawalAsset}/${depositAsset}`;
  const subject = encodeURI('Issue regarding my Swap via MyCrypto');
  const body = encodeURI(`Please include the information below if this issue is regarding your order:
${pertinentInformation}
`);

  return { subject, body, fallbackBody: pertinentInformation };
};
