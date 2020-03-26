import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Panel } from '@mycrypto/ui';

import { IFormikFields, ISignedTx, IStepComponentProps, ITxReceipt } from 'v2/types';
import { useStateReducer } from 'v2/utils';
import { BREAK_POINTS, COLORS } from 'v2/theme';
import { useScreenSize } from 'v2/vendor';

import { ProtectTxProtection } from './ProtectTxProtection';
import { ProtectTxSign } from './ProtectTxSign';
import { ProtectTxReport } from './ProtectTxReport';
import { ProtectTxConfigFactory, protectTxConfigInitialState } from '../txStateFactory';
import { WithProtectTxApiFactory } from '../withProtectStateFactory';
import ProtectTxModalBackdrop from './ProtectTxModalBackdrop';
import { ProtectTxButton } from './ProtectTxButton';

const WithProtectTxWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

const WithProtectTxMain = styled.div<{ protectTxShow: boolean }>`
  position: relative;
  flex: 0 0 100%;
  width: 100%;
  max-width: 100%;

  ${({ protectTxShow }) =>
    protectTxShow &&
    `
    @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
      flex: 0 0 calc(100vw - 375px - 4.5rem);
      width: calc(100vw - 375px - 4.5rem);
      max-width: calc(100vw - 375px - 4.5rem);
    }
  `};

  @media (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    flex: 0 0 calc(650px - 4.5rem);
    width: calc(650px - 4.5rem);
    max-width: calc(650px - 4.5rem);
  }
`;

const WithProtectTxSide = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 375px;
  min-width: 375px;
  max-width: 100vw;
  margin-top: calc(-1.5rem - 44px - 15px);

  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    position: initial;
    width: 375px;
    margin-top: -1.5rem;
    margin-left: 2.25rem;
    border-left: 15px solid ${COLORS.BG_GRAY};
    min-height: calc(100% + 115px);
    transform: unset;

    section {
      position: relative;
      height: 100%;
      padding: 30px 15px 15px;
      box-shadow: none;
    }
  }
`;

interface Props extends IStepComponentProps {
  withProtectApi?: WithProtectTxApiFactory;
  customDetails?: JSX.Element;
  protectTxButton?(): JSX.Element;
}

export function withProtectTx(
  WrappedComponent: React.ComponentType<Props>,
  SignComponent: React.ComponentType<IStepComponentProps>
) {
  return function WithProtectTransaction({
    txConfig: txConfigMain,
    signedTx: signedTxMain,
    txReceipt: txReceiptMain,
    onComplete: onCompleteMain,
    withProtectApi,
    customDetails,
    resetFlow
  }: Props) {
    const {
      handleProtectTxSubmit,
      handleProtectTxConfirmAndSend,
      protectTxFactoryState
    } = useStateReducer(ProtectTxConfigFactory, {
      txConfig: protectTxConfigInitialState,
      txReceipt: null
    });

    const {
      withProtectState: { protectTxShow, stepIndex, protectTxEnabled, isWeb3Wallet },
      handleTransactionReport,
      goToNextStep,
      goToInitialStepOrFetchReport,
      formCallback,
      showHideProtectTx
    } = withProtectApi!;

    const { isMdScreen } = useScreenSize();

    const toggleProtectTxShow = useCallback(
      e => {
        e.preventDefault();

        if (showHideProtectTx) {
          showHideProtectTx(!protectTxShow);
        }
      },
      [showHideProtectTx]
    );

    return useMemo(
      () => (
        <WithProtectTxWrapper>
          <WithProtectTxMain protectTxShow={protectTxShow}>
            <WrappedComponent
              txConfig={txConfigMain}
              signedTx={signedTxMain}
              txReceipt={txReceiptMain}
              onComplete={(values: IFormikFields | ITxReceipt | ISignedTx | null) => {
                onCompleteMain(values);
              }}
              withProtectApi={withProtectApi}
              customDetails={customDetails}
              resetFlow={resetFlow}
              protectTxButton={() =>
                protectTxEnabled ? (
                  <ProtectTxButton reviewReport={true} onClick={toggleProtectTxShow} />
                ) : (
                  <></>
                )
              }
            />
          </WithProtectTxMain>
          {protectTxShow && (
            <>
              {!isMdScreen && <ProtectTxModalBackdrop onBackdropClick={toggleProtectTxShow} />}
              <WithProtectTxSide>
                <Panel>
                  {(() => {
                    if (stepIndex === 0) {
                      const { values } = formCallback();

                      return (
                        <ProtectTxProtection
                          handleProtectTxSubmit={handleProtectTxSubmit}
                          withProtectApi={withProtectApi!}
                          sendAssetsValues={values}
                        />
                      );
                    } else if (stepIndex === 1) {
                      return (
                        <ProtectTxSign withProtectApi={withProtectApi!}>
                          <>
                            <SignComponent
                              txConfig={(({ txConfig }) => txConfig)(protectTxFactoryState)}
                              onComplete={(
                                payload: IFormikFields | ITxReceipt | ISignedTx | null
                              ) => {
                                handleTransactionReport().then(() => {
                                  handleProtectTxConfirmAndSend(
                                    payload,
                                    goToNextStep,
                                    isWeb3Wallet
                                  );
                                });
                              }}
                              resetFlow={goToInitialStepOrFetchReport}
                            />
                          </>
                        </ProtectTxSign>
                      );
                    } else if (stepIndex === 2) {
                      return <ProtectTxReport withProtectApi={withProtectApi} />;
                    }

                    return <></>;
                  })()}
                </Panel>
              </WithProtectTxSide>
            </>
          )}
        </WithProtectTxWrapper>
      ),
      [
        stepIndex,
        txConfigMain,
        signedTxMain,
        txReceiptMain,
        protectTxShow,
        formCallback,
        protectTxFactoryState,
        isMdScreen,
        protectTxEnabled,
        isWeb3Wallet
      ]
    );
  };
}
