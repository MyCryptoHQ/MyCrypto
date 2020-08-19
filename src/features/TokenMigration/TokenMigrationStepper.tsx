import React, { useEffect, useReducer } from 'react';

import { useTxMulti } from '@utils';
import { TxParcel, ITxStatus, ISimpleTxFormFull } from '@types';
import { default as GeneralStepper, IStepperPath } from '@components/GeneralStepper';
import { ROUTE_PATHS } from '@config';
import { translateRaw } from '@translations';
import { WALLET_STEPS } from '@components';

import { TokenMigrationState, ITokenMigrationFormFull } from './types';
import { createMigrationTx, createApproveTx } from './helpers';
import TokenMigrationForm from './components/TokenMigrationForm';
import { TokenMigrationMultiTx } from './components';
import TokenMigrationReceipt from './components/TokenMigrationReceipt';
import { tokenMigrationReducer } from './TokenMigrationStepper.reducer';

const TokenMigrationStepper = () => {
  const [reducerState, dispatch] = useReducer(tokenMigrationReducer, {});

  const { state, prepareTx, sendTx, stopYield, initWith } = useTxMulti();
  const { canYield, isSubmitting, transactions } = state;
  const { account }: TokenMigrationState = reducerState;

  const steps: IStepperPath[] = [
    {
      label: translateRaw('REP_TOKEN_MIGRATION'),
      component: TokenMigrationForm,
      props: {
        account,
        isSubmitting
      },
      actions: (formData: ITokenMigrationFormFull) => {
        initWith(
          () => {
            const purchaseTx = createMigrationTx(formData);
            const approveTx = createApproveTx(formData);
            return Promise.resolve([approveTx, purchaseTx]);
          },
          formData.account,
          formData.account.network
        );
        dispatch({ type: tokenMigrationReducer.actionTypes.FORM_SUBMIT, payload: formData });
      }
    },
    ...transactions.flatMap((tx: Required<TxParcel>, idx) => [
      {
        label: translateRaw('CONFIRM_TRANSACTION'),
        backBtnText: translateRaw('REP_TOKEN_MIGRATION'),
        component: TokenMigrationMultiTx,
        props: {
          account,
          isSubmitting,
          transactions,
          currentTxIdx: idx
        },
        actions: (_: ISimpleTxFormFull, goToNextStep: () => void) => {
          if (transactions.length > 1) {
            prepareTx(tx.txRaw);
          } else {
            goToNextStep();
          }
        }
      },
      {
        label: '',
        backBtnText: translateRaw('CONFIRM_TRANSACTION'),
        component: account && WALLET_STEPS[account.wallet],
        props: {
          network: account && account.network,
          senderAccount: account,
          rawTransaction: tx.txRaw,
          onSuccess: sendTx
        }
      }
    ]),
    {
      label: translateRaw('REP_TOKEN_MIGRATION_RECEIPT'),
      component: TokenMigrationReceipt,
      props: {
        account,
        transactions
      }
    }
  ];

  return (
    <GeneralStepper
      onRender={(goToNextStep) => {
        // Allows to execute code when state has been updated after MTX hook has run
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
