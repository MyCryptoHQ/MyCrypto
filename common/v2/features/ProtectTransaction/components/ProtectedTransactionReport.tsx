import React, { FC, useCallback } from 'react';
import ProtectIcon from './icons/ProtectIcon';
import wizardIcon from 'assets/images/icn-protect-transcation-wizard.svg';
import {
  CryptoScamDBBaseResponse,
  CryptoScamDBInfoResponse
} from '../../../services/ApiService/CryptoScamDB/types';
import upperFirst from 'lodash/upperFirst';

import './ProtectedTransactionReport.scss';
import { WithProtectApiFactory } from '../withProtectStateFactory';
import { fromWei, Wei } from '../../../services/EthService/utils';
import moment from 'moment';

interface Props {
  withProtectApi?: WithProtectApiFactory;
}

const formatDate = (date: number): string => moment.unix(date).format('MM/DD/YYYY');

export const ProtectedTransactionReport: FC<Props> = ({ withProtectApi }) => {
  const {
    withProtectState: {
      receiverAddress,
      cryptoScamAddressReport,
      etherscanBalanceReport,
      etherscanLastTxReport,
      asset
    }
  } = withProtectApi!;

  const getShortAddress = useCallback(() => {
    if (receiverAddress && receiverAddress.length >= 10) {
      return `${receiverAddress.substr(0, 6)}...${receiverAddress.substr(
        receiverAddress.length - 4
      )}`;
    }
    return 'Invalid address!';
  }, [receiverAddress]);

  const getAccountBalanceTimelineEntry = useCallback(() => {
    let balance = 'Unknown balance';
    if (etherscanBalanceReport) {
      const { result } = etherscanBalanceReport;
      balance = parseFloat(fromWei(Wei(result), 'ether')).toFixed(6);
    }

    let assetTicker = '';
    if (etherscanBalanceReport && asset) {
      assetTicker = asset.ticker;
    }

    return (
      <li>
        <div className="timeline-badge">2</div>
        <div className="timeline-panel">
          <h6>Recipient Account Balance:</h6>
          <p className="text-muted">
            {balance} {assetTicker}
          </p>
        </div>
      </li>
    );
  }, [etherscanBalanceReport]);

  const getLastTxReportTimelineEntry = useCallback(() => {
    let lastSentToken: { value: string; ticker: string; timestamp: string } | null = null;
    if (etherscanLastTxReport && etherscanLastTxReport.result.length) {
      const {
        result: [firstResult]
      } = etherscanLastTxReport;
      if (firstResult) {
        const { tokenSymbol: ticker, value, timeStamp } = firstResult;
        lastSentToken = {
          ticker,
          value: parseFloat(fromWei(Wei(value), 'ether')).toFixed(6),
          timestamp: formatDate(parseInt(timeStamp, 10))
        };
      }
    }

    return (
      <li>
        <div className="timeline-badge">3</div>
        <div className="timeline-panel">
          <h6>Recipient Account Activity:</h6>
          {/*<h6>Last Sent {assetTicker}:</h6>
        <p className="text-muted">1.01 {assetTicker} on 12/24/2019</p>*/}
          <h6>Last Sent Token:</h6>
          <p className="text-muted">
            {lastSentToken &&
              `${lastSentToken.value} ${lastSentToken.ticker} on ${lastSentToken.timestamp}`}
            {!lastSentToken && 'No information available!'}
          </p>
        </div>
      </li>
    );
  }, [etherscanLastTxReport]);

  const getTimeline = useCallback(() => {
    if (!cryptoScamAddressReport) {
      return <div className="loading" />;
    }

    const { success } = cryptoScamAddressReport;

    if (!success) {
      // No info for account
      return (
        <ul className="timeline">
          <li>
            <div className="timeline-badge">1</div>
            <div className="timeline-panel">
              <h6>UNKNOWN ACCOUNT:</h6>
              <p className="text-no-info">
                This doesn't necessarily mean it’s 'safe' or 'unsafe', just that no information has
                been collected at this time.
              </p>
            </div>
          </li>
          {getAccountBalanceTimelineEntry()}
          {getLastTxReportTimelineEntry()}
        </ul>
      );
    } else {
      const {
        result: { status, entries }
      } = cryptoScamAddressReport as CryptoScamDBInfoResponse;
      if (status === 'blocked') {
        // Malicious account
        const accountTags = [...new Set(entries.map(e => e.type))];
        const accountComments = [
          ...new Set(
            entries.map(e =>
              upperFirst(
                `${e.reporter} has the following note about this address: "${e.description}"`
              )
            )
          )
        ];

        return (
          <ul className="timeline">
            <li>
              <div className="timeline-badge">1</div>
              <div className="timeline-panel">
                <h6>UNKNOWN ACCOUNT:</h6>
                <p className="text-error">
                  Malicious: This account has been marked as {`"${accountTags.join('", "')}"`}
                </p>
                {accountComments.map((c, i) => (
                  <p key={i} className="text-error">
                    <br />
                    {c}
                  </p>
                ))}
              </div>
            </li>
            {getAccountBalanceTimelineEntry()}
            {getLastTxReportTimelineEntry()}
          </ul>
        );
      } else if (status === 'whitelisted') {
        // Verified account
        const accountComments = [
          ...new Set(entries.map(e => upperFirst(`${e.type}: ${e.description}`)))
        ];

        return (
          <ul className="timeline">
            <li>
              <div className="timeline-badge">1</div>
              <div className="timeline-panel">
                <h6>KNOWN ACCOUNT:</h6>
                {accountComments.map((c, i) => (
                  <p key={i} className="text-success">
                    {c}
                    <br />
                  </p>
                ))}
              </div>
            </li>
            {getAccountBalanceTimelineEntry()}
            {getLastTxReportTimelineEntry()}
          </ul>
        );
      }
    }

    return (
      <ul className="timeline">
        <li>
          <div className="timeline-badge">1</div>
          <div className="timeline-panel">
            <h6>UNKNOWN ACCOUNT:</h6>
            <p className="text-danger">We are not sure what is going on with this address.</p>
          </div>
        </li>
        {getAccountBalanceTimelineEntry()}
        {getLastTxReportTimelineEntry()}
      </ul>
    );
  }, [cryptoScamAddressReport, getAccountBalanceTimelineEntry]);

  return (
    <div className="ProtectedTransactionReport">
      <ProtectIcon size="lg" />
      <h4 className="ProtectedTransactionReport-title">Your Report for Address</h4>
      <h4 className="ProtectedTransactionReport-title ProtectedTransactionReport-title-address">
        {getShortAddress()}
      </h4>
      {cryptoScamAddressReport && (
        <h5 className="ProtectedTransactionReport-subtitle">
          If any of the information below is unexpected, please stop and review the address. Where
          did you copy the address from? Who gave you the address?
        </h5>
      )}
      <div className="ProtectedTransactionReport-timeline">{getTimeline()}</div>
      {cryptoScamAddressReport && (
        <>
          <p className="ProtectedTransactionReport-view-comments">
            View comments for this account on &nbsp;
            <a
              href={`https://etherscan.io/address/${
                (cryptoScamAddressReport as CryptoScamDBBaseResponse).input
              }`}
              rel="noreferrer"
              target="_blank"
            >
              Etherscan
            </a>
            .
            <img src={wizardIcon} alt="Wizard" />
          </p>
          <p className="ProtectedTransactionReport-footer-text">
            If everything looks good, click "Next" on the left to see a preview of your main
            transaction. Upon confirming and sending the transaction, you'll get{' '}
            <span className="highlighted">20 seconds</span> to cancel if you change your mind.
          </p>
        </>
      )}
    </div>
  );
};
