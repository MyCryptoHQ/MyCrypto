import React from 'react';
import { simpleRender } from 'test-utils';
import find from 'lodash/find';

import { translateRaw } from '@translations';
import { TUuid, TAddress } from '@types';
import { ETHUUID, noOp } from '@utils';
import { assets } from '@database/seed/assets';

import { ProtectTxReportUI } from '../components/ProtectTxReport';
import { PTXReport, NansenReportType } from '../types';

const asset = find(assets, { uuid: ETHUUID as TUuid })!;

const unknownReport: PTXReport = {
  asset,
  address: '0x88F7B1E26c3A52CA3cD8aF4ba1b448391eb31d88' as TAddress,
  labels: [],
  status: NansenReportType.UNKNOWN,
  balance: '0',
  lastTransaction: { ticker: 'ETH', value: '1', timestamp: '1593632079' }
};

const scamReport: PTXReport = {
  ...unknownReport,
  address: '0x820C415a17Bf165a174e6B55232D956202d9470f' as TAddress,
  labels: ['Scam'],
  status: NansenReportType.MALICIOUS
};

const verifiedReport: PTXReport = {
  ...unknownReport,
  address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress,
  labels: ['MyCrypto: Donate'],
  status: NansenReportType.WHITELISTED
};

const renderComponent = (report: PTXReport) => {
  return simpleRender(<ProtectTxReportUI report={report} onHide={noOp} isWeb3={false} />);
};

/* Test components */
describe('ProtectTxReport', () => {
  test('Can render unknown state', () => {
    const { getByText } = renderComponent(unknownReport);
    const selector = translateRaw('PROTECTED_TX_TIMELINE_UNKNOWN_ACCOUNT').trim();
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('Can render scam state', () => {
    const { getByText } = renderComponent(scamReport);
    const selector = translateRaw('PROTECTED_TX_TIMELINE_MALICIOUS', {
      $tags: `"${scamReport.labels![0]}"`
    }).trim();
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('Can render verified state', () => {
    const { getByText } = renderComponent(verifiedReport);
    const selector = translateRaw('PROTECTED_TX_TIMELINE_TAGS', {
      $tags: `"${verifiedReport.labels![0]}"`
    }).trim();
    expect(
      getByText(translateRaw('PROTECTED_TX_TIMELINE_KNOWN_ACCOUNT').trim())
    ).toBeInTheDocument();
    expect(getByText(selector)).toBeInTheDocument();
  });
});
