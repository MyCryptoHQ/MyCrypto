import React, { useMemo } from 'react';
import { IFormikFields, ISignedTx, IStepComponentProps, ITxReceipt } from '../../../types';

import { Button, Panel } from '@mycrypto/ui';

import './WithProtectTranscation.scss';
import { useStateReducer } from '../../../utils';
import { ProtectionThisTransaction } from './ProtectionThisTransaction';
import { SignProtectedTransaction } from './SignProtectedTransaction';
import { ProtectedTransactionReport } from './ProtectedTransactionReport';
import { ProtectedTxConfigFactory, protectedTxConfigInitialState } from '../txStateFactory';
import { WithProtectApiFactory } from '../withProtectStateFactory';

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
        <div className="WithProtectTransaction">
          <div className="WithProtectTransaction-main">
            <WrappedComponent
              txConfig={txConfigMain}
              onComplete={(values: IFormikFields | ITxReceipt | ISignedTx | null) => {
                onCompleteMain(values);
              }}
              withProtectApi={withProtectApi}
              customDetails={customDetails}
              resetFlow={resetFlow}
            />
          </div>
          {protectTxEnabled && (
            <div className="WithProtectTransaction-side">
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
            </div>
          )}
        </div>
      ),
      [stepIndex, txConfigMain, protectTxEnabled, formCallback, protectedTransactionTxFactoryState]
    );
  };
}
