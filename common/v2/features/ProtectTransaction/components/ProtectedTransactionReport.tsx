import React, { FC, useCallback } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import upperFirst from 'lodash/upperFirst';

import { translateRaw } from 'v2/translations';
import useMediaQuery from 'v2/vendor/react-use/useMediaQuery';
import { fromWei, Wei } from 'v2/services';
import { BREAK_POINTS, COLORS } from 'v2/theme';
import {
  CryptoScamDBBaseResponse,
  CryptoScamDBInfoResponse
} from 'v2/services/ApiService/CryptoScamDB/types';

import { IWithProtectApi } from '../types';
import ProtectedTransactionBase from './ProtectedTransactionBase';
import ProtectIconCheck from './icons/ProtectIconCheck';
import WizardIcon from './icons/WizardIcon';
import CloseIcon from './icons/CloseIcon';

const formatDate = (date: number): string => moment.unix(date).format('MM/DD/YYYY');

const ProtectedTransactionReportStyled = styled(ProtectedTransactionBase)`
  .title-address {
    margin: 0 0 10px;
  }

  .view-comments {
    position: relative;
    font-size: 16px;
    line-height: 24px;
    margin: 0 50px 30px 80px;
    color: ${COLORS.PURPLE};
    text-align: left;

    > svg {
      position: absolute;
      left: -75px;
      bottom: -50px;
      transform: translateY(-50%);
    }

    @media (min-width: ${BREAK_POINTS.SCREEN_LG}) {
      > svg {
        right: -200px;
        left: unset;
        bottom: unset;
      }
    }

    a {
      color: ${COLORS.PURPLE};
      text-decoration: underline;
    }
  }

  .footer-text {
    font-size: 16px;
    line-height: 24px;

    .highlighted {
      color: ${COLORS.PURPLE};
    }
  }
`;

const Timeline = styled.ul`
  list-style: none;
  padding: 20px 0 30px;
  margin: 0;
  position: relative;
`;

const TimelineEntry = styled.li`
  position: relative;

  &:before {
    content: ' ';
    display: table;
  }

  &:after {
    content: ' ';
    display: table;
    clear: both;
  }

  &:not(:last-child) {
    position: relative;
    margin-bottom: 20px;

    > div:last-child {
      &:before {
        top: 45px;
        bottom: 0;
        position: absolute;
        content: ' ';
        width: 2px;
        background-color: ${COLORS.PURPLE};
        left: -27px;
        height: 100%;
      }
    }
  }
`;

const TimelineBadge = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  left: 15px;
  margin-left: -25px;
  border: 2px solid ${COLORS.PURPLE};
  border-radius: 50%;
  transform: translateX(50%);
  color: ${COLORS.PURPLE};
  font-size: 16px;
  line-height: 44px;
  background: ${COLORS.WHITE};
  text-align: center;
  z-index: 1000;
`;

const TimelinePanel = styled.div`
  min-height: 50px;
  width: 80%;
  padding-top: 12px;
  padding-left: 10px;
  float: right;
  position: relative;
  font-size: 18px;
  line-height: 24px;
  text-align: left;

  > h6 {
    margin: 0;
    color: #1c314e;
    font-weight: 700;
    text-transform: uppercase;
  }

  > p {
    margin: 0;

    &.text-success {
      color: ${COLORS.SUCCESS_GREEN_LIGHT};
    }

    &.text-no-info {
      color: ${COLORS.PURPLE};
    }

    &.text-danger {
      color: ${COLORS.WARNING_ORANGE};
    }

    &.text-error {
      color: ${COLORS.ERROR_RED_LIGHT};
    }

    &.text-muted {
      color: ${COLORS.BLUE_GREY};
    }
  }
`;

export const ProtectedTransactionReport: FC<IWithProtectApi> = ({ withProtectApi }) => {
  const {
    withProtectState: {
      receiverAddress,
      cryptoScamAddressReport,
      etherscanBalanceReport,
      etherscanLastTxReport,
      asset,
      isWeb3Wallet
    },
    showHideTransactionProtection
  } = withProtectApi!;

  const isLgScreen = useMediaQuery(`(min-width: ${BREAK_POINTS.SCREEN_LG})`);
  const isSmScreen = useMediaQuery(`(min-width: ${BREAK_POINTS.SCREEN_SM})`);

  const getShortAddress = useCallback(() => {
    if (receiverAddress && receiverAddress.length >= 10) {
      return `${receiverAddress.substr(0, 6)}...${receiverAddress.substr(
        receiverAddress.length - 4
      )}`;
    }
    return translateRaw('ADD_TOKEN_INVALID_ADDRESS');
  }, [receiverAddress]);

  const getAccountBalanceTimelineEntry = useCallback(() => {
    let balance = translateRaw('PROTECTED_TX_UNKNOWN_BALANCE');
    if (etherscanBalanceReport) {
      const { result } = etherscanBalanceReport;
      balance = parseFloat(fromWei(Wei(result), 'ether')).toFixed(6);
    }

    let assetTicker = '';
    if (etherscanBalanceReport && asset) {
      assetTicker = asset.ticker;
    }

    return (
      <TimelineEntry>
        <TimelineBadge>2</TimelineBadge>
        <TimelinePanel>
          <h6>{translateRaw('PROTECTED_TX_RECIPIENT_ACCOUNT_BALANCE')}</h6>
          <p className="text-muted">
            {balance} {assetTicker}
          </p>
        </TimelinePanel>
      </TimelineEntry>
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
      <TimelineEntry>
        <TimelineBadge>3</TimelineBadge>
        <TimelinePanel>
          <h6>{translateRaw('PROTECTED_TX_RECIPIENT_ACCOUNT_ACTIVITY')}</h6>
          {/*<h6>Last Sent {assetTicker}:</h6>
        <p className="text-muted">1.01 {assetTicker} on 12/24/2019</p>*/}
          <h6>{translateRaw('PROTECTED_TX_LAST_SENT_TOKEN')}</h6>
          <p className="text-muted">
            {lastSentToken &&
              `${lastSentToken.value} ${lastSentToken.ticker} on ${lastSentToken.timestamp}`}
            {!lastSentToken && translateRaw('PROTECTED_TX_NO_INFORMATION_AVAILABLE')}
          </p>
        </TimelinePanel>
      </TimelineEntry>
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
        <Timeline>
          <TimelineEntry>
            <TimelineBadge>1</TimelineBadge>
            <TimelinePanel>
              <h6>{translateRaw('PROTECTED_TX_TIMELINE_UNKNOWN_ACCOUNT')}</h6>
              <p className="text-no-info">
                {translateRaw('PROTECTED_TX_TIMELINE_UNKNOWN_ACCOUNT_DESC')}
              </p>
            </TimelinePanel>
          </TimelineEntry>
          {getAccountBalanceTimelineEntry()}
          {getLastTxReportTimelineEntry()}
        </Timeline>
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
                translateRaw('PROTECTED_TX_TIMELINE_COMMENT', {
                  $reporter: e.reporter ? e.reporter : '',
                  $description: e.description ? e.description : ''
                })
              )
            )
          )
        ];

        return (
          <Timeline>
            <TimelineEntry>
              <TimelineBadge>1</TimelineBadge>
              <TimelinePanel>
                <h6>{translateRaw('PROTECTED_TX_TIMELINE_UNKNOWN_ACCOUNT')}</h6>
                <p className="text-error">
                  {translateRaw('PROTECTED_TX_TIMELINE_MALICIOUS', {
                    $tags: `"${accountTags.join('", "')}"`
                  })}
                </p>
                {accountComments.map((c, i) => (
                  <p key={i} className="text-error">
                    <br />
                    {c}
                  </p>
                ))}
              </TimelinePanel>
            </TimelineEntry>
            {getAccountBalanceTimelineEntry()}
            {getLastTxReportTimelineEntry()}
          </Timeline>
        );
      } else if (status === 'whitelisted') {
        // Verified account
        const accountComments = [
          ...new Set(entries.map(e => upperFirst(`${e.type}: ${e.description}`)))
        ];

        return (
          <Timeline>
            <TimelineEntry>
              <TimelineBadge>1</TimelineBadge>
              <TimelinePanel>
                <h6>{translateRaw('PROTECTED_TX_TIMELINE_KNOWN_ACCOUNT')}</h6>
                {accountComments.map((c, i) => (
                  <p key={i} className="text-success">
                    {c}
                    <br />
                  </p>
                ))}
              </TimelinePanel>
            </TimelineEntry>
            {getAccountBalanceTimelineEntry()}
            {getLastTxReportTimelineEntry()}
          </Timeline>
        );
      }
    }

    return (
      <Timeline>
        <TimelineEntry>
          <TimelineBadge>1</TimelineBadge>
          <TimelinePanel>
            <h6>{translateRaw('PROTECTED_TX_TIMELINE_UNKNOWN_ACCOUNT')}</h6>
            <p className="text-danger">
              {translateRaw('PROTECTED_TX_TIMELINE_NOT_SURE_ABOUT_ADDRESS')}
            </p>
          </TimelinePanel>
        </TimelineEntry>
        {getAccountBalanceTimelineEntry()}
        {getLastTxReportTimelineEntry()}
      </Timeline>
    );
  }, [cryptoScamAddressReport, getAccountBalanceTimelineEntry]);

  const onHideModel = useCallback(
    (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
      e.preventDefault();

      if (showHideTransactionProtection) {
        showHideTransactionProtection(false);
      }
    },
    [showHideTransactionProtection]
  );

  return (
    <ProtectedTransactionReportStyled>
      {!isSmScreen && <CloseIcon size="lg" onClick={onHideModel} />}
      <ProtectIconCheck size="lg" />
      <h4>{translateRaw('PROTECTED_TX_REPORT_TITLE')}</h4>
      <h4 className="title-address">{getShortAddress()}</h4>
      {cryptoScamAddressReport && (
        <h5 className="subtitle">{translateRaw('PROTECTED_TX_REPORT_SUBTITLE')}</h5>
      )}
      <div className="timeline">{getTimeline()}</div>
      {cryptoScamAddressReport && (
        <>
          <p className="view-comments">
            {(linkTranslation => {
              if (linkTranslation.includes('$etherscanLink')) {
                const linkTranslationSplit = linkTranslation.split('$etherscanLink');
                return (
                  <>
                    {linkTranslationSplit[0]}
                    <a
                      href={`https://etherscan.io/address/${
                        (cryptoScamAddressReport as CryptoScamDBBaseResponse).input
                      }`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Etherscan
                    </a>
                    {linkTranslationSplit[1]}
                  </>
                );
              }
              return linkTranslation;
            })(translateRaw('PROTECTED_TX_ETHERSCAN_EXTERNAL_LINK'))}
            <WizardIcon size={isLgScreen ? 'lg' : 'sm'} />
          </p>
          <p className="footer-text">
            {translateRaw('PROTECTED_TX_REPORT_FOOTER_TEXT')}
            {!isWeb3Wallet &&
              (t => {
                const tSplit = t.split('$');
                if (tSplit.length === 3) {
                  return (
                    <>
                      {tSplit[0]}
                      <span className="highlighted">{tSplit[1]}</span>
                      {tSplit[2]}
                    </>
                  );
                }
                return t;
              })(translateRaw('PROTECTED_TX_REPORT_FOOTER_TEXT_NOT_WEB3_WALLET'))}
          </p>
        </>
      )}
    </ProtectedTransactionReportStyled>
  );
};
