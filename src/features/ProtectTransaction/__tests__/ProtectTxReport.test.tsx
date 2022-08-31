import { simpleRender } from 'test-utils';

import { loadingReport, scamReport, unknownReport, verifiedReport } from '@fixtures';
import { translateRaw } from '@translations';
import { noOp } from '@utils';

import { ProtectTxReportUI } from '../components/ProtectTxReport';
import { PTXReport } from '../types';

const renderComponent = (report: PTXReport) => {
  return simpleRender(<ProtectTxReportUI report={report} onHide={noOp} isWeb3={false} />);
};

/* Test components */
describe('ProtectTxReport', () => {
  test('Can render loading state', () => {
    const { getByTestId } = renderComponent(loadingReport);
    expect(getByTestId('spinner')).toBeInTheDocument();
  });

  test('Can render unknown state', () => {
    const { getByText } = renderComponent(unknownReport);
    const selector = translateRaw('PROTECTED_TX_TIMELINE_UNKNOWN_ACCOUNT').trim();
    expect(getByText(selector)).toBeInTheDocument();
    expect(getByText(unknownReport.balance!, { exact: false })).toBeInTheDocument();
    expect(getByText(unknownReport.lastTransaction!.value, { exact: false })).toBeInTheDocument();
    expect(
      getByText(unknownReport.lastTransaction!.timestamp, { exact: false })
    ).toBeInTheDocument();
  });

  test('Can render scam state', () => {
    const { getByText } = renderComponent(scamReport);
    const selector = translateRaw('PROTECTED_TX_TIMELINE_MALICIOUS', {
      $tags: `"${scamReport.labels![0]}"`
    }).trim();
    expect(getByText(selector)).toBeInTheDocument();
    expect(getByText(scamReport.balance!, { exact: false })).toBeInTheDocument();
    expect(getByText(scamReport.lastTransaction!.value, { exact: false })).toBeInTheDocument();
    expect(getByText(scamReport.lastTransaction!.timestamp, { exact: false })).toBeInTheDocument();
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
    expect(getByText(verifiedReport.balance!, { exact: false })).toBeInTheDocument();
    expect(getByText(verifiedReport.lastTransaction!.value, { exact: false })).toBeInTheDocument();
    expect(
      getByText(verifiedReport.lastTransaction!.timestamp, { exact: false })
    ).toBeInTheDocument();
  });
});
