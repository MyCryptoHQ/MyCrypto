import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IFormikFields, ISignedTx, IStepComponentProps, ITxReceipt } from '../../../types';

import { Panel } from '@mycrypto/ui';

import './WithProtectTranscation.scss';
import {
  IProtectTransactionProps,
  ProtectTransactionAction,
  ProtectTransactionActions,
  SendFormCallbackType
} from '../types';
import { useStateReducer } from '../../../utils';
import SignTransaction from '../../SendAssets/components/SignTransaction';
import { ProtectionThisTransaction } from './ProtectionThisTransaction';
import { SignProtectedTransaction } from './SignProtectedTransaction';
import { ProtectedTransactionReport } from './ProtectedTransactionReport';
import {
  ProtectedTxConfigFactory,
  protectedTxConfigInitialState,
  protectedTxReceiptInitialState
} from '../stateFactory';

const numOfSteps = 3;

export function withProtectTransaction(
  WrappedComponent: React.ComponentType<Partial<IStepComponentProps & IProtectTransactionProps>>
) {
  return function WithProtectTransaction({
    txConfig: txConfigMain,
    onComplete: onCompleteMain
  }: IStepComponentProps) {
    const {
      handleProtectedTransactionSubmit,
      handleProtectedTransactionConfirmAndSend,
      protectedTransactionTxFactoryState
    } = useStateReducer(ProtectedTxConfigFactory, {
      txConfig: protectedTxConfigInitialState,
      txReceipt: protectedTxReceiptInitialState
    });

    const formCallback = useRef<SendFormCallbackType>(() => ({ isValid: false, values: null }));

    const [stepIndex, setStepIndex] = useState(0);
    const [sidePanelVisible, setSidePanelVisible] = useState(false);

    useEffect(() => {
      const contentPanel = document.querySelector('[class^=ContentPanel__ContentPanelWrapper]');

      /*if (contentPanel && !contentPanel.classList.contains('has-side-panel')) {
        contentPanel.classList.add('has-side-panel');
      }*/

      return () => {
        if (contentPanel && contentPanel.classList.contains('has-side-panel')) {
          contentPanel.classList.remove('has-side-panel');
          setSidePanelVisible(false);
        }
      };
    }, [setSidePanelVisible]);

    const goOnNextStep = useCallback(() => {
      setStepIndex(step => (step + 1) % numOfSteps);
    }, [setStepIndex]);

    const goOnInitialStep = useCallback(() => {
      setStepIndex(0);
    }, [setStepIndex]);

    const onProtectTransactionAction = async (action: ProtectTransactionActions) => {
      switch (action.actionType) {
        case ProtectTransactionAction.SHOW_HIDE_TRANSACTION_PROTECTION:
          const contentPanel = document.querySelector('[class^=ContentPanel__ContentPanelWrapper]');

          if (action.payload) {
            if (contentPanel && !contentPanel.classList.contains('has-side-panel')) {
              contentPanel.classList.add('has-side-panel');
            }
            setSidePanelVisible(true);
          } else {
            if (contentPanel && contentPanel.classList.contains('has-side-panel')) {
              contentPanel.classList.remove('has-side-panel');
            }
            setSidePanelVisible(false);
          }
          break;

        case ProtectTransactionAction.SEND_FORM_CALLBACK:
          if (action.payload) {
            formCallback.current = action.payload;
          }
          break;

        case ProtectTransactionAction.PROTECT_MY_TRANSACTION:
          const { isValid, values } = formCallback.current();

          if (isValid) {
            const { amount } = action.paylaod;
            try {
              await handleProtectedTransactionSubmit({
                ...values,
                amount
              });
              goOnNextStep();
            } catch (e) {
              console.error(e);
            }
          }
          break;
      }
    };

    return useMemo(
      () => (
        <div className="WithProtectTransaction">
          <div className="WithProtectTransaction-main">
            <WrappedComponent
              txConfig={txConfigMain}
              onComplete={(values: IFormikFields | ITxReceipt | ISignedTx | null) => {
                onCompleteMain(values);
                // handleFormSubmit(values, () => {
                // });
              }}
              onProtectTransactionAction={onProtectTransactionAction}
            />
          </div>
          {sidePanelVisible && (
            <div className="WithProtectTransaction-side">
              <Panel>
                {(() => {
                  if (stepIndex === 0) {
                    const { values } = formCallback.current();

                    return (
                      <ProtectionThisTransaction
                        onProtectTransactionAction={onProtectTransactionAction}
                        sendAssetsValues={values}
                      />
                    );
                  } else if (stepIndex === 2) {
                    return (
                      <SignProtectedTransaction>
                        <SignTransaction
                          txConfig={(({ txConfig }) => txConfig)(
                            protectedTransactionTxFactoryState
                          )}
                          onComplete={(payload: IFormikFields | ITxReceipt | ISignedTx | null) => {
                            handleProtectedTransactionConfirmAndSend(payload, () => {
                              goOnNextStep();
                            });
                          }}
                          resetFlow={() => {
                            goOnInitialStep();
                          }}
                        />
                      </SignProtectedTransaction>
                    );
                  } else if (stepIndex === 1) {
                    return (
                      <ProtectedTransactionReport
                        txReport={(({ txReport }) => txReport)(protectedTransactionTxFactoryState)}
                      />
                    );
                  }

                  return <></>;
                })()}
              </Panel>
            </div>
          )}
        </div>
      ),
      [
        onProtectTransactionAction,
        stepIndex,
        setStepIndex,
        txConfigMain,
        sidePanelVisible,
        formCallback,
        protectedTransactionTxFactoryState
      ]
    );
  };
}
