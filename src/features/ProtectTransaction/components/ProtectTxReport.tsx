import { FC, MouseEventHandler, useCallback, useContext } from 'react';

import styled from 'styled-components';

import { EthAddress, LinkApp, PoweredByText, Spinner, VerticalStepper } from '@components';
import CloseIcon from '@components/icons/CloseIcon';
import ProtectIconCheck from '@components/icons/ProtectIconCheck';
import WizardIcon from '@components/icons/WizardIcon';
import { StepData } from '@components/VerticalStepper';
import { ETHAddressExplorer } from '@config';
import { BREAK_POINTS, COLORS, FONT_SIZE, LINE_HEIGHT, SPACING } from '@theme';
import { Trans, translateRaw } from '@translations';
import { useScreenSize } from '@utils';

import { ProtectTxContext } from '../ProtectTxProvider';
import { NansenReportType, PTXReport } from '../types';
import ProtectTxBase from './ProtectTxBase';

const Wrapper = styled(ProtectTxBase)<{ isSmScreen: boolean }>`
  .title-address {
    margin: 0 0 ${SPACING.SM};
  }

  .timeline {
    text-align: left;
    padding: 0 20px;
  }

  ${({ isSmScreen }) => `
  svg:nth-of-type(${isSmScreen ? 1 : 2}) {
    height: 100%;
    max-height: 73px;
  }
  `}

  .view-comments {
    position: relative;
    font-size: ${FONT_SIZE.BASE};
    line-height: ${LINE_HEIGHT.XL};
    margin: 0 50px 30px 80px;
    color: ${COLORS.PURPLE};
    text-align: left;

    > svg {
      height: auto;
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
    color: ${COLORS.SUCCESS_GREEN};
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

const PoweredByWrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: flex-end;
`;

export const ProtectTxReport: FC = () => {
  const {
    state: { isWeb3Wallet },
    showHideProtectTx,
    getReport
  } = useContext(ProtectTxContext);

  const onHideModel: MouseEventHandler<SVGSVGElement> = useCallback(
    (e) => {
      e.preventDefault();

      if (showHideProtectTx) {
        showHideProtectTx(false);
      }
    },
    [showHideProtectTx]
  );

  const report = getReport();

  return <ProtectTxReportUI report={report} isWeb3={isWeb3Wallet} onHide={onHideModel} />;
};

interface Props {
  report: PTXReport;
  isWeb3: boolean;
  onHide: MouseEventHandler<SVGSVGElement>;
}

export const ProtectTxReportUI = ({ report, isWeb3, onHide }: Props) => {
  const { isSmScreen } = useScreenSize();
  const { address, labels } = report;
  const steps = getTimelineSteps(report);

  return (
    <Wrapper isSmScreen={isSmScreen}>
      {!isSmScreen && <CloseIcon size="lg" onClick={onHide} />}
      <ProtectIconCheck size="lg" />
      <h4>{translateRaw('PROTECTED_TX_REPORT_TITLE')}</h4>
      <SEthAddress>
        <EthAddress address={address} truncate={true} isCopyable={false} />
      </SEthAddress>
      {labels && <h5 className="subtitle">{translateRaw('PROTECTED_TX_REPORT_SUBTITLE')}</h5>}
      <div className="timeline">
        {labels ? (
          <VerticalStepper currentStep={-1} size="lg" color={COLORS.PURPLE} steps={steps} />
        ) : (
          <Spinner color="brand" />
        )}
      </div>
      {labels && (
        <>
          <p className="view-comments">
            <Trans
              id="PROTECTED_TX_ETHERSCAN_EXTERNAL_LINK"
              variables={{
                $etherscanLink: () => (
                  <LinkApp
                    color={COLORS.PURPLE}
                    isExternal={true}
                    href={`${ETHAddressExplorer(address)}`}
                  >
                    Etherscan
                  </LinkApp>
                )
              }}
            />
            <WizardIcon size="lg" />
          </p>
          <p className="footer-text">
            {translateRaw('PROTECTED_TX_REPORT_FOOTER_TEXT')}
            {!isWeb3 && (
              <>
                {' '}
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
              </>
            )}
          </p>
        </>
      )}
      <PoweredByWrapper>
        <PoweredByText provider="NANSEN" />
      </PoweredByWrapper>
    </Wrapper>
  );
};

const getAccountBalanceTimelineEntry = (report: PTXReport): StepData => {
  const { balance: reportBalance, asset } = report;
  const assetTicker = asset && asset.ticker;
  const balance = reportBalance
    ? `${reportBalance} ${assetTicker}`
    : translateRaw('PROTECTED_TX_UNKNOWN_BALANCE');

  return {
    title: translateRaw('PROTECTED_TX_RECIPIENT_ACCOUNT_BALANCE'),
    content: <StepperDescText className="text-muted">{balance}</StepperDescText>
  };
};

const getLastTxReportTimelineEntry = (report: PTXReport): StepData => {
  const lastSentTxReport = report.lastTransaction;
  const lastSentTx = lastSentTxReport
    ? translateRaw('PROTECTED_TX_LAST_TX_DETAILS', {
        $value: lastSentTxReport.value,
        $ticker: lastSentTxReport.ticker,
        $timestamp: lastSentTxReport.timestamp
      })
    : translateRaw('PROTECTED_TX_NO_INFORMATION_AVAILABLE');

  return {
    title: (
      <>
        {translateRaw('PROTECTED_TX_RECIPIENT_ACCOUNT_ACTIVITY')}
        <br />
        {translateRaw('PROTECTED_TX_LAST_SENT_TX')}
      </>
    ),
    content: <StepperDescText className="text-muted">{lastSentTx}</StepperDescText>
  };
};

const getNansenStep = (report: PTXReport) => {
  const { status, labels } = report;
  if (labels && labels.length > 0) {
    const tags = `"${labels.join('", "')}"`;
    switch (status) {
      case NansenReportType.MALICIOUS:
        return {
          title: translateRaw('PROTECTED_TX_TIMELINE_UNKNOWN_ACCOUNT'),
          content: (
            <>
              <StepperDescText className="text-error">
                {translateRaw('PROTECTED_TX_TIMELINE_MALICIOUS', {
                  $tags: tags
                })}
              </StepperDescText>
            </>
          )
        };
      case NansenReportType.WHITELISTED:
        return {
          title: translateRaw('PROTECTED_TX_TIMELINE_KNOWN_ACCOUNT'),
          content: (
            <>
              <StepperDescText className="text-success">
                {translateRaw('PROTECTED_TX_TIMELINE_TAGS', {
                  $tags: tags
                })}
              </StepperDescText>
            </>
          )
        };
      case NansenReportType.UNKNOWN:
        return {
          title: translateRaw('PROTECTED_TX_TIMELINE_UNKNOWN_ACCOUNT'),
          content: (
            <>
              <StepperDescText className="text-no-info">
                {translateRaw('PROTECTED_TX_TIMELINE_TAGS', {
                  $tags: tags
                })}
              </StepperDescText>
            </>
          )
        };
    }
  }
  // No info for account
  return {
    title: translateRaw('PROTECTED_TX_TIMELINE_UNKNOWN_ACCOUNT'),
    content: (
      <StepperDescText className="text-no-info">
        {translateRaw('PROTECTED_TX_TIMELINE_UNKNOWN_ACCOUNT_DESC')}
      </StepperDescText>
    )
  };
};

const getTimelineSteps = (report: PTXReport) => {
  return [
    getNansenStep(report),
    getAccountBalanceTimelineEntry(report),
    getLastTxReportTimelineEntry(report)
  ];
};
