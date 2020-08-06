import React, { useEffect } from 'react';

import { useStateReducer, useTxMulti } from '@utils';
import { ITxReceipt, ITxConfig, TxParcel, ITxStatus } from '@types';
import { default as GeneralStepper, IStepperPath } from '@components/GeneralStepper';
import { ROUTE_PATHS } from '@config';
import { translateRaw } from '@translations';
import { WALLET_STEPS } from '@components';

import { tokenMigrationConfig } from './config';
import TokenMigrationInteractionFactory from './stateFactory';
import { ISimpleTxFormFull, TokenMigrationState, ITokenMigrationFormFull } from './types';
import { createMigrationTx, createApproveTx } from './helpers';
import { isERC20Tx } from '../SendAssets';
import TokenMigrationForm from './components/TokenMigrationForm';
import { TokenMigrationMultiTx } from './components';
import TokenMigrationReceipt from './components/TokenMigrationReceipt';

const initialTokenMigrationFlowState = {
  tokenConfig: tokenMigrationConfig,
  txConfig: (undefined as unknown) as ITxConfig,
  txReceipt: (undefined as unknown) as ITxReceipt
};

const TokenMigrationStepper = () => {
  const { tokenMigrationFlowState, handleUserInputFormSubmit } = useStateReducer(
    TokenMigrationInteractionFactory,
    initialTokenMigrationFlowState
  );

  const { state, prepareTx, sendTx, stopYield, initWith } = useTxMulti();
  const { canYield, isSubmitting, transactions } = state;
  const { account }: TokenMigrationState = tokenMigrationFlowState;

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
            return Promise.resolve(
              isERC20Tx(formData.asset) ? [approveTx, purchaseTx] : [purchaseTx]
            );
          },
          formData.account,
          formData.account.network
        );
        handleUserInputFormSubmit(formData);
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
        label: translateRaw('CONFIRM_TRANSACTION'),
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
      defaultBackPathLabel={ROUTE_PATHS.DASHBOARD.title} // @todo: Change this.
    />
  );
};
export default TokenMigrationStepper;
