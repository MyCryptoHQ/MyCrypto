import React, { FC, useCallback, useContext } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import upperFirst from 'lodash/upperFirst';

import { Trans, translateRaw } from '@translations';
import { fromWei, isValidETHAddress, Wei } from '@services';
import { BREAK_POINTS, COLORS, FONT_SIZE, LINE_HEIGHT, SPACING } from '@theme';
import { CryptoScamDBBaseResponse, CryptoScamDBInfoResponse } from '@services/ApiService';
import ProtectIconCheck from '@components/icons/ProtectIconCheck';
import WizardIcon from '@components/icons/WizardIcon';
import CloseIcon from '@components/icons/CloseIcon';
import { ETHAddressExplorer } from '@config';
import { EthAddress, LinkOut, VerticalStepper } from '@components';
import { StepData } from '@components/VerticalStepper';
import { truncate, useScreenSize, isSameAddress } from '@utils';
import { TAddress } from '@types';

import ProtectTxBase from './ProtectTxBase';
import { ProtectTxContext } from '../ProtectTxProvider';
import { ProtectTxUtils } from '../utils';

const formatDate = (date: number): string => moment.unix(date).format('MM/DD/YYYY');

const Wrapper = styled(ProtectTxBase)`
  .title-address {
    margin: 0 0 ${SPACING.SM};
  }

  .timeline {
    text-align: left;
    padding: 0 20px;
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

const StepperDescText = styled.p`
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
`;

const SEthAddress = styled.div`
  &&& button {
    margin: 0;
    font-family: 'Lato', sans-serif;
    font-size: ${FONT_SIZE.XL};
    font-weight: 700;
    line-height: ${LINE_HEIGHT.XXL};
  }
`;

export const ProtectTxReport: FC = () => {
  const protectTxContext = useContext(ProtectTxContext);
  const getProTxValue = ProtectTxUtils.isProtectTxDefined(protectTxContext);
  if (!getProTxValue()) {
    throw new Error('ProtectTxProtection requires to be wrapped in ProtectTxContext!');
  }

  const {
    state: {
      etherscanBalanceReport,
      etherscanLastTxReport,
      cryptoScamAddressReport,
      asset,
      receiverAddress,
      isWeb3Wallet
    },
    showHideProtectTx
  } = protectTxContext;

  const { isSmScreen } = useScreenSize();

  const getAccountBalanceTimelineEntry = useCallback((): StepData => {
    let balance = translateRaw('PROTECTED_TX_UNKNOWN_BALANCE');
    if (etherscanBalanceReport) {
      const { result } = etherscanBalanceReport;
      balance = parseFloat(fromWei(Wei(result), 'ether')).toFixed(6);
    }

    let assetTicker = '';
    if (etherscanBalanceReport && asset) {
      assetTicker = asset.ticker;
    }

    return {
      title: translateRaw('PROTECTED_TX_RECIPIENT_ACCOUNT_BALANCE'),
      content: (
        <StepperDescText className="text-muted">
          {balance} {assetTicker}
        </StepperDescText>
      )
    };
  }, [etherscanBalanceReport]);

  const getLastTxReportTimelineEntry = useCallback((): StepData => {
    let lastSentToken: { value: string; ticker: string; timestamp: string } | null = null;
    if (etherscanLastTxReport && etherscanLastTxReport.result.length) {
      const { result } = etherscanLastTxReport;
      const firstSentResult = result.find((r) =>
        receiverAddress ? isSameAddress(r.from as TAddress, receiverAddress as TAddress) : false
      );
      if (firstSentResult) {
        const { tokenSymbol: ticker, value, timeStamp } = firstSentResult;
        lastSentToken = {
          ticker,
          value: parseFloat(fromWei(Wei(value), 'ether')).toFixed(6),
          timestamp: formatDate(parseInt(timeStamp, 10))
        };
      }
    }

    return {
      title: (
        <>
          {translateRaw('PROTECTED_TX_RECIPIENT_ACCOUNT_ACTIVITY')}
          <br />
          {translateRaw('PROTECTED_TX_LAST_SENT_TOKEN')}
        </>
      ),
      content: (
        <StepperDescText className="text-muted">
          {lastSentToken &&
            `${lastSentToken.value} ${lastSentToken.ticker} on ${lastSentToken.timestamp}`}
          {!lastSentToken && translateRaw('PROTECTED_TX_NO_INFORMATION_AVAILABLE')}
        </StepperDescText>
      )
    };
  }, [etherscanLastTxReport]);

  const getTimeline = useCallback(() => {
    if (!cryptoScamAddressReport) {
      return <div className="loading" />;
    }

    const { success } = cryptoScamAddressReport;
    const steps: StepData[] = [];

    if (!success) {
      // No info for account
      steps.push({
        title: translateRaw('PROTECTED_TX_TIMELINE_UNKNOWN_ACCOUNT'),
        content: (
          <StepperDescText className="text-no-info">
            {translateRaw('PROTECTED_TX_TIMELINE_UNKNOWN_ACCOUNT_DESC')}
          </StepperDescText>
        )
      });
    } else {
      const {
        result: { status, entries }
      } = cryptoScamAddressReport as CryptoScamDBInfoResponse;
      if (status === 'blocked') {
        // Malicious account
        const accountTags = [...new Set(entries.map((e) => e.type))];
        const accountComments = [
          ...new Set(
            entries.map((e) =>
              upperFirst(
                translateRaw('PROTECTED_TX_TIMELINE_COMMENT', {
                  $reporter: e.reporter ? e.reporter : '',
                  $description: e.description ? e.description : ''
                })
              )
            )
          )
        ];

        steps.push({
          title: translateRaw('PROTECTED_TX_TIMELINE_UNKNOWN_ACCOUNT'),
          content: (
            <>
              <StepperDescText className="text-error">
                {translateRaw('PROTECTED_TX_TIMELINE_MALICIOUS', {
                  $tags: `"${accountTags.join('", "')}"`
                })}
              </StepperDescText>
              {accountComments.map((c, i) => (
                <StepperDescText key={i} className="text-error">
                  <br />
                  {c}
                </StepperDescText>
              ))}
            </>
          )
        });
      } else if (status === 'whitelisted') {
        // Verified account
        const accountComments = [
          ...new Set(entries.map((e) => upperFirst(`${e.type}: ${e.description}`)))
        ];

        steps.push({
          title: translateRaw('PROTECTED_TX_TIMELINE_KNOWN_ACCOUNT'),
          content: (
            <>
              {accountComments.map((c, i) => (
                <StepperDescText key={i} className="text-success">
                  {c}
                  <br />
                </StepperDescText>
              ))}
            </>
          )
        });
      } else {
        steps.push({
          title: translateRaw('PROTECTED_TX_TIMELINE_UNKNOWN_ACCOUNT'),
          content: (
            <StepperDescText className="text-danger">
              {translateRaw('PROTECTED_TX_TIMELINE_NOT_SURE_ABOUT_ADDRESS')}
            </StepperDescText>
          )
        });
      }
    }

    return (
      <VerticalStepper
        currentStep={-1}
        size="lg"
        color={COLORS.PURPLE}
        steps={[...steps, getAccountBalanceTimelineEntry(), getLastTxReportTimelineEntry()]}
      />
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
      {receiverAddress && isValidETHAddress(receiverAddress) && (
        <SEthAddress>
          <EthAddress address={receiverAddress} truncate={truncate} isCopyable={false} />
        </SEthAddress>
      )}
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
