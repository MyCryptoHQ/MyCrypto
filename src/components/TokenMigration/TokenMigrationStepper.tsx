import React, { useEffect, useReducer } from 'react';

import { createSignConfirmAndReceiptSteps } from '@components';
import { default as GeneralStepper, IStepperPath } from '@components/GeneralStepper';
import { ROUTE_PATHS } from '@config';
import { translateRaw } from '@translations';
import {
  ITokenMigrationConfig,
  ITokenMigrationFormFull,
  ITxStatus,
  TokenMigrationState
} from '@types';
import { useTxMulti } from '@utils';

import ConfirmTokenMigration from './components/TokenMigrationConfirm';
import TokenMigrationForm from './components/TokenMigrationForm';
import ConfirmTokenMigrationMultiTx from './components/TokenMigrationMultiTx';
import TokenMigrationReceipt from './components/TokenMigrationReceipt';
import { tokenMigrationReducer } from './TokenMigrationStepper.reducer';

interface Props {
  tokenMigrationConfig: ITokenMigrationConfig;
}

const TokenMigrationStepper = ({ tokenMigrationConfig }: Props) => {
  const [reducerState, dispatch] = useReducer(tokenMigrationReducer, {});

  const { state, prepareTx, sendTx, stopYield, initWith } = useTxMulti();
  const { canYield, isSubmitting, transactions } = state;
  const { account, amount }: TokenMigrationState = reducerState;

  const steps: IStepperPath[] = [
    {
      label: tokenMigrationConfig.formTitle,
      component: TokenMigrationForm,
      props: {
        tokenMigrationConfig,
        account,
        isSubmitting
      },
      actions: (formData: ITokenMigrationFormFull) => {
        initWith(
          () => {
            const txs = tokenMigrationConfig.txConstructionConfigs.map((txConstructionConfig) => ({
              ...txConstructionConfig.constructTxFn(formData),
              type: txConstructionConfig.txType
            }));
            return Promise.resolve(txs);
          },
          formData.account,
          formData.account.network
        );
        dispatch({ type: tokenMigrationReducer.actionTypes.FORM_SUBMIT, payload: formData });
      }
    },
    ...createSignConfirmAndReceiptSteps({
      transactions,
      backStepTitle: tokenMigrationConfig.formTitle,
      amount: amount!,
      account: account!,
      flowConfig: tokenMigrationConfig,
      receiptTitle: tokenMigrationConfig.receiptTitle,
      multiTxTitle: translateRaw('CONFIRM_TRANSACTION'),
      isSubmitting,
      receiptComponent: TokenMigrationReceipt,
      multiTxComponent: transactions.length > 1 ? ConfirmTokenMigrationMultiTx : ConfirmTokenMigration,
      sendTx,
      prepareTx
    })
  ];

  return (
    <GeneralStepper
      onRender={(goToNextStep) => {
        // Allows to execute code when state has been updated after MTX hook has run
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (!canYield) return;
          // Make sure to prepare ETH tx before showing to user
          if (transactions.length === 1 && transactions[0].status === ITxStatus.PREPARING) {
            prepareTx(transactions[0].txRaw);
          } else {
            // Go to next step after preparing tx for MTX
            goToNextStep();
          }
          stopYield();
        }, [canYield]);
      }}
      steps={steps}
      defaultBackPath={ROUTE_PATHS.DASHBOARD.path}
      defaultBackPathLabel={ROUTE_PATHS.DASHBOARD.title}
    />
  );
};
export default TokenMigrationStepper;
