import React, { useMemo } from 'react';
import { IFormikFields, ISignedTx, IStepComponentProps, ITxReceipt } from '../../../types';

import { Button, Panel } from '@mycrypto/ui';

import { useStateReducer } from '../../../utils';
import { ProtectionThisTransaction } from './ProtectionThisTransaction';
import { SignProtectedTransaction } from './SignProtectedTransaction';
import { ProtectedTransactionReport } from './ProtectedTransactionReport';
import { ProtectedTxConfigFactory, protectedTxConfigInitialState } from '../txStateFactory';
import { WithProtectApiFactory } from '../withProtectStateFactory';
import styled from 'styled-components';
import { COLORS } from '../../../theme';

const WithProtectTransactionWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

const WithProtectTransactionMain = styled.div`
  position: relative;
  flex: 0 0 calc(650px - 4.5rem);
  width: calc(650px - 4.5rem);
  max-width: calc(650px - 4.5rem);
`;

const WithProtectTransactionSide = styled.div`
  width: 375px;
  min-width: 375px;
  margin-top: -1.5rem;
  margin-left: 2.25rem;
  border-left: 15px solid ${COLORS.BG_GRAY};
  min-height: calc(100% + 115px);

  section {
    position: relative;
    height: 100%;
    padding: 30px 15px 15px;
    box-shadow: none;
  }
`;

interface WithProtectTransactionProp extends IStepComponentProps {
  withProtectApi?: WithProtectApiFactory;
  customDetails?: JSX.Element;
}

export function withProtectTransaction(
  WrappedComponent: React.ComponentType<WithProtectTransactionProp>,
  SignComponent: React.ComponentType<IStepComponentProps>
) {
  return function WithProtectTransaction({
    txConfig: txConfigMain,
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
      withProtectState: { protectTxEnabled, stepIndex },
      handleTransactionReport,
      goOnNextStep,
      goOnInitialStep,
      formCallback
    } = withProtectApi!;

    return useMemo(
      () => (
        <WithProtectTransactionWrapper>
          <WithProtectTransactionMain>
            <WrappedComponent
              txConfig={txConfigMain}
              onComplete={(values: IFormikFields | ITxReceipt | ISignedTx | null) => {
                onCompleteMain(values);
              }}
              withProtectApi={withProtectApi}
              customDetails={customDetails}
              resetFlow={resetFlow}
            />
          </WithProtectTransactionMain>
          {protectTxEnabled && (
            <WithProtectTransactionSide>
              <Panel>
                {(() => {
                  if (stepIndex === 0) {
                    const { values } = formCallback();

                    return (
                      <ProtectionThisTransaction
                        handleProtectedTransactionSubmit={handleProtectedTransactionSubmit}
                        withProtectApi={withProtectApi!}
                        sendAssetsValues={values}
                      />
                    );
                  } else if (stepIndex === 1) {
                    return (
                      <SignProtectedTransaction>
                        <>
                          <SignComponent
                            txConfig={(({ txConfig }) => txConfig)(
                              protectedTransactionTxFactoryState
                            )}
                            onComplete={(
                              payload: IFormikFields | ITxReceipt | ISignedTx | null
                            ) => {
                              handleTransactionReport().then(() => {
                                handleProtectedTransactionConfirmAndSend(payload, () => {
                                  goOnNextStep();
                                });
                              });
                            }}
                            resetFlow={() => {
                              goOnInitialStep();
                            }}
                          />
                          <Button
                            type="submit"
                            onClick={e => {
                              // TODO: Remove, only for testing
                              e.preventDefault();

                              handleTransactionReport().then(() => {
                                goOnNextStep();
                              });
                            }}
                          >
                            Skip (testing purpose)
                          </Button>
                        </>
                      </SignProtectedTransaction>
                    );
                  } else if (stepIndex === 2) {
                    return <ProtectedTransactionReport withProtectApi={withProtectApi} />;
                  }

                  return <></>;
                })()}
              </Panel>
            </WithProtectTransactionSide>
          )}
        </WithProtectTransactionWrapper>
      ),
      [stepIndex, txConfigMain, protectTxEnabled, formCallback, protectedTransactionTxFactoryState]
    );
  };
}
