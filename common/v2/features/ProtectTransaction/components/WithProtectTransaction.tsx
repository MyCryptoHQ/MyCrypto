import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { IStepComponentProps } from '../../../types';

import { Panel } from '@mycrypto/ui';

import './WithProtectTranscation.scss';
import {
  IProtectTransactionProps,
  ProtectTransactionAction,
  ProtectTransactionActions,
  SendFormCallbackType
} from '../types';

export function withProtectTransaction(
  WrappedComponent: React.ComponentType<Partial<IStepComponentProps & IProtectTransactionProps>>,
  ProtectTransactionComponent: React.ComponentType<IProtectTransactionProps>
) {
  return function WithProtectTransaction({ txConfig, onComplete }: IStepComponentProps) {
    const formCallback = useRef<SendFormCallbackType>(() => ({ isValid: false, values: {} }));

    useEffect(() => {
      const contentPanel = document.querySelector('[class^=ContentPanel__ContentPanelWrapper]');
      if (contentPanel) {
        contentPanel.classList.add('has-side-panel');
      }
    }, []);

    const onProtectTransactionAction = useCallback(
      (action: ProtectTransactionActions) => {
        switch (action.actionType) {
          case ProtectTransactionAction.SHOW_HIDE_TRANSACTION_PROTECTION:
            const contentPanel = document.querySelector(
              '[class^=ContentPanel__ContentPanelWrapper]'
            );
            if (contentPanel) {
              if (action.payload) {
                if (!contentPanel.classList.contains('has-side-panel')) {
                  contentPanel.classList.add('has-side-panel');
                }
              } else {
                if (contentPanel.classList.contains('has-side-panel')) {
                  contentPanel.classList.remove('has-side-panel');
                }
              }
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
              onComplete(values);
            }
            break;
        }
      },
      [formCallback]
    );

    return useMemo(
      () => (
        <div className="WithProtectTransaction">
          <div className="WithProtectTransaction-main">
            <WrappedComponent
              txConfig={txConfig}
              onComplete={onComplete}
              onProtectTransactionAction={onProtectTransactionAction}
            />
          </div>
          <div className="WithProtectTransaction-side">
            <Panel>
              <ProtectTransactionComponent
                onProtectTransactionAction={onProtectTransactionAction}
              />
            </Panel>
          </div>
        </div>
      ),
      [onProtectTransactionAction]
    );
  };
}
