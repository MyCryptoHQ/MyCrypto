import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Panel } from '@mycrypto/ui';

import useMediaQuery from 'v2/vendor/react-use/useMediaQuery';
import { IFormikFields, ISignedTx, IStepComponentProps, ITxReceipt } from 'v2/types';
import { useStateReducer } from 'v2/utils';
import { BREAK_POINTS, COLORS } from 'v2/theme';

import { ProtectTxProtection } from './ProtectTxProtection';
import { ProtectTxSign } from './ProtectTxSign';
import { ProtectTxReport } from './ProtectTxReport';
import { ProtectedTxConfigFactory, protectedTxConfigInitialState } from '../txStateFactory';
import { WithProtectApiFactory } from '../withProtectStateFactory';
import ProtectTxModalBackdrop from './ProtectTxModalBackdrop';
import { TransactionProtectionButton } from './TransactionProtectionButton';

const WithProtectTransactionWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

const WithProtectTransactionMain = styled.div<{ protectTxShow: boolean }>`
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

const WithProtectTransactionSide = styled.div`
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

interface WithProtectTransactionProp extends IStepComponentProps {
  withProtectApi?: WithProtectApiFactory;
  customDetails?: JSX.Element;
  protectTxButton?(): JSX.Element;
}

export function withProtectTransaction(
  WrappedComponent: React.ComponentType<WithProtectTransactionProp>,
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
  }: WithProtectTransactionProp) {
    const {
      handleProtectedTransactionSubmit,
      handleProtectedTransactionConfirmAndSend,
      protectedTransactionTxFactoryState
    } = useStateReducer(ProtectedTxConfigFactory, {
      txConfig: protectedTxConfigInitialState,
      txReceipt: null
    });

    const {
      withProtectState: { protectTxShow, stepIndex, protectTxEnabled, isWeb3Wallet },
      handleTransactionReport,
      goOnNextStep,
      goOnInitialStepOrFetchReport,
      formCallback,
      showHideTransactionProtection
    } = withProtectApi!;

    const isMdScreen = useMediaQuery(`(min-width: ${BREAK_POINTS.SCREEN_MD})`);

    const toggleProtectTxShow = useCallback(
      e => {
        e.preventDefault();

        if (showHideTransactionProtection) {
          showHideTransactionProtection(!protectTxShow);
        }
      },
      [showHideTransactionProtection]
    );

    return useMemo(
      () => (
        <WithProtectTransactionWrapper>
          <WithProtectTransactionMain protectTxShow={protectTxShow}>
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
                  <TransactionProtectionButton reviewReport={true} onClick={toggleProtectTxShow} />
                ) : (
                  <></>
                )
              }
            />
          </WithProtectTransactionMain>
          {protectTxShow && (
            <>
              {!isMdScreen && <ProtectTxModalBackdrop onBackdropClick={toggleProtectTxShow} />}
              <WithProtectTransactionSide>
                <Panel>
                  {(() => {
                    if (stepIndex === 0) {
                      const { values } = formCallback();

                      return (
                        <ProtectTxProtection
                          handleProtectedTransactionSubmit={handleProtectedTransactionSubmit}
                          withProtectApi={withProtectApi!}
                          sendAssetsValues={values}
                        />
                      );
                    } else if (stepIndex === 1) {
                      return (
                        <ProtectTxSign withProtectApi={withProtectApi!}>
                          <>
                            <SignComponent
                              txConfig={(({ txConfig }) => txConfig)(
                                protectedTransactionTxFactoryState
                              )}
                              onComplete={(
                                payload: IFormikFields | ITxReceipt | ISignedTx | null
                              ) => {
                                handleTransactionReport().then(() => {
                                  handleProtectedTransactionConfirmAndSend(
                                    payload,
                                    goOnNextStep,
                                    isWeb3Wallet
                                  );
                                });
                              }}
                              resetFlow={goOnInitialStepOrFetchReport}
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
              </WithProtectTransactionSide>
            </>
          )}
        </WithProtectTransactionWrapper>
      ),
      [
        stepIndex,
        txConfigMain,
        signedTxMain,
        txReceiptMain,
        protectTxShow,
        formCallback,
        protectedTransactionTxFactoryState,
        isMdScreen,
        protectTxEnabled,
        isWeb3Wallet
      ]
    );
  };
}
