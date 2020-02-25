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
import { TxConfigFactory, txConfigInitialState } from '../../SendAssets/stateFactory';
import SignTransaction from '../../SendAssets/components/SignTransaction';
import { ProtectionThisTransaction } from './ProtectionThisTransaction';
import { SignProtectedTransaction } from './SignProtectedTransaction';
import { ProtectedTransactionReport } from './ProtectedTransactionReport';

const numOfSteps = 3;

export function withProtectTransaction(
  WrappedComponent: React.ComponentType<Partial<IStepComponentProps & IProtectTransactionProps>>
) {
  return function WithProtectTransaction({
    txConfig: txConfigMain,
    onComplete: onCompleteMain
  }: IStepComponentProps) {
    const {
      handleFormSubmit,
      /*handleConfirmAndSign,
      handleConfirmAndSend,
      handleSignedTx,
      handleSignedWeb3Tx,*/
      txFactoryState
    } = useStateReducer(TxConfigFactory, { txConfig: txConfigInitialState, txReceipt: null });

    const formCallback = useRef<SendFormCallbackType>(() => ({ isValid: false, values: {} }));

    const [stepIndex, setStepIndex] = useState(0);
    const [sidePanelVisible, setSidePanelVisible] = useState(false);

    useEffect(() => {
      return () => {
        const contentPanel = document.querySelector('[class^=ContentPanel__ContentPanelWrapper]');

        if (contentPanel) {
          if (contentPanel.classList.contains('has-side-panel')) {
            contentPanel.classList.remove('has-side-panel');
            setSidePanelVisible(false);
          }
        }
      };
    }, [setSidePanelVisible]);

    const onNextStep = useCallback(() => {
      setStepIndex(step => (step + 1) % numOfSteps);
    }, [setStepIndex]);

    const onInitialStep = useCallback(() => {
      setStepIndex(0);
    }, [setStepIndex]);

    const onProtectTransactionAction = useCallback(
      (action: ProtectTransactionActions) => {
        switch (action.actionType) {
          case ProtectTransactionAction.SHOW_HIDE_TRANSACTION_PROTECTION:
            const contentPanel = document.querySelector(
              '[class^=ContentPanel__ContentPanelWrapper]'
            );

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
              handleFormSubmit(values, () => {
                /*debugger;*/
                onNextStep();
                // onCompleteMain(values);
              });
            }
            break;
        }
      },
      [formCallback, onNextStep, setSidePanelVisible]
    );

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
                        txConfig={values}
                      />
                    );
                  } else if (stepIndex === 1) {
                    return (
                      <SignProtectedTransaction>
                        <SignTransaction
                          txConfig={(({ txConfig }) => txConfig)(txFactoryState)}
                          onComplete={() => {
                            onNextStep();
                            // handleSignedTx(payload);
                          }}
                          resetFlow={() => {
                            onInitialStep();
                          }}
                        />
                      </SignProtectedTransaction>
                    );
                  } else if (stepIndex === 2) {
                    return <ProtectedTransactionReport />;
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
        formCallback
      ]
    );
  };
}
