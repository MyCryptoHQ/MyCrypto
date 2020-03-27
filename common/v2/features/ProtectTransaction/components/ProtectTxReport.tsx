import React, { FC, useCallback } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import upperFirst from 'lodash/upperFirst';

import { Trans, translateRaw } from 'v2/translations';
import { useScreenSize } from 'v2/vendor';
import { fromWei, Wei } from 'v2/services';
import { BREAK_POINTS, COLORS, FONT_SIZE, LINE_HEIGHT, SPACING } from 'v2/theme';
import { CryptoScamDBBaseResponse, CryptoScamDBInfoResponse } from 'v2/services/ApiService';
import { ProtectIconCheck, WizardIcon, CloseIcon } from 'v2/components/icons';
import { ETHAddressExplorer } from 'v2/config';
import { LinkOut } from 'v2/components';
import { truncate } from 'v2/utils';

import { IWithProtectApi } from '../types';
import ProtectTxBase from './ProtectTxBase';

const formatDate = (date: number): string => moment.unix(date).format('MM/DD/YYYY');

const Wrapper = styled(ProtectTxBase)`
  .title-address {
    margin: 0 0 ${SPACING.SM};
  }

  .view-comments {
    position: relative;
    font-size: ${FONT_SIZE.BASE};
    line-height: ${LINE_HEIGHT.XL};
    margin: 0 50px 30px 80px;
    color: ${COLORS.PURPLE};
    text-align: left;

    > svg {
      position: absolute;
      left: -75px;
      bottom: -50px;
      transform: translateY(-50%);
      max-width: 61px;
      max-height: 54px;
    }

    @media (min-width: ${BREAK_POINTS.SCREEN_LG}) {
      > svg {
        right: -200px;
        left: unset;
        bottom: unset;
        max-width: 186px;
        max-height: 169px;
      }
    }
  }

  .footer-text {
    font-size: ${FONT_SIZE.BASE};
    line-height: ${LINE_HEIGHT.XL};

    .highlighted {
      color: ${COLORS.PURPLE};
    }
  }
`;

const Timeline = styled.ul`
  list-style: none;
  padding: ${SPACING.BASE} 0 ${SPACING.MD};
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
    margin-bottom: ${SPACING.BASE};

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
  margin-left: -30px;
  border: 2px solid ${COLORS.PURPLE};
  border-radius: 50%;
  transform: translateX(50%);
  color: ${COLORS.PURPLE};
  font-size: ${FONT_SIZE.BASE};
  line-height: 44px;
  background: ${COLORS.WHITE};
  text-align: center;
  z-index: 1000;

  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin-left: -25px;
  }
`;

const TimelinePanel = styled.div`
  min-height: 50px;
  width: 80%;
  padding-top: 12px;
  padding-left: ${SPACING.SM};
  float: right;
  position: relative;
  font-size: ${FONT_SIZE.MD};
  line-height: ${LINE_HEIGHT.XL};
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

export const ProtectTxReport: FC<IWithProtectApi> = ({ withProtectApi }) => {
  const {
    withProtectState: {
      receiverAddress,
      cryptoScamAddressReport,
      etherscanBalanceReport,
      etherscanLastTxReport,
      asset,
      isWeb3Wallet
    },
    showHideProtectTx
  } = withProtectApi!;

  const { isSmScreen } = useScreenSize();

  const getShortAddress = useCallback(() => {
    if (receiverAddress && receiverAddress.length >= 10) {
      truncate(receiverAddress);
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

      if (showHideProtectTx) {
        showHideProtectTx(false);
      }
    },
    [showHideProtectTx]
  );

  return (
    <Wrapper>
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
            <Trans
              id="PROTECTED_TX_ETHERSCAN_EXTERNAL_LINK"
              variables={{
                $etherscanLink: () => (
                  <LinkOut
                    showIcon={false}
                    inline={true}
                    fontSize={FONT_SIZE.BASE}
                    fontColor={COLORS.PURPLE}
                    underline={true}
                    link={`${ETHAddressExplorer(
                      (cryptoScamAddressReport as CryptoScamDBBaseResponse).input
                    )}`}
                    text="Etherscan"
                  />
                )
              }}
            />
            <WizardIcon size="lg" />
          </p>
          <p className="footer-text">
            {translateRaw('PROTECTED_TX_REPORT_FOOTER_TEXT')}
            {!isWeb3Wallet && (
              <Trans
                id="PROTECTED_TX_REPORT_FOOTER_TEXT_NOT_WEB3_WALLET"
                variables={{
                  $20seconds: () => (
                    <span className="highlighted">
                      {translateRaw('PROTECTED_TX_REPORT_20_SEC')}
                    </span>
                  )
                }}
              />
            )}
          </p>
        </>
      )}
    </Wrapper>
  );
};
