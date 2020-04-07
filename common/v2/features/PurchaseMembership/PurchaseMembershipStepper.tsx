import React, { useEffect } from 'react';

import { useStateReducer, useTxMulti } from 'v2/utils';
import { ITxReceipt, ITxConfig, TxParcel, ITxSigned, ITxHash, ITxStatus } from 'v2/types';
import { default as GeneralStepper, IStepperPath } from 'v2/components/GeneralStepper';
import { ROUTE_PATHS } from 'v2/config';
import { translateRaw } from 'v2/translations';
import { WALLET_STEPS } from 'v2/components';

import { defaultMembershipObject } from './config';
import {
  MembershipPurchaseForm,
  MembershipPurchaseReceipt,
  ConfirmMembershipPurchase,
  ConfirmMembershipPurchaseMultiTx
} from './components';
import MembershipInteractionFactory from './stateFactory';
import { MembershipSimpleTxFormFull, MembershipPurchaseState } from './types';
import { createPurchaseTx, createApproveTx } from './helpers';
import { isERC20Tx } from '../SendAssets';

const initialMembershipFlowState = {
  membershipSelected: defaultMembershipObject,
  txConfig: (undefined as unknown) as ITxConfig,
  txReceipt: (undefined as unknown) as ITxReceipt
};

const PurchaseMembershipStepper = () => {
  const { purchaseMembershipFlowState, handleUserInputFormSubmit } = useStateReducer(
    MembershipInteractionFactory,
    initialMembershipFlowState
  );

  const { state, prepareTx, sendTx, stopYield, initWith } = useTxMulti();
  const { canYield, isSubmitting, transactions } = state;
  const { account, membershipSelected }: MembershipPurchaseState = purchaseMembershipFlowState;

  const steps: IStepperPath[] = [
    {
      label: translateRaw('PURCHASE_MEMBERSHIP'),
      component: MembershipPurchaseForm,
      props: {
        account,
        membershipSelected,
        isSubmitting
      },
      actions: (formData: MembershipSimpleTxFormFull) => {
        initWith(
          () => {
            const purchaseTx = createPurchaseTx(formData);
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
        backBtnText: translateRaw('PURCHASE_MEMBERSHIP'),
        component:
          transactions.length > 1 ? ConfirmMembershipPurchaseMultiTx : ConfirmMembershipPurchase,
        props: {
          membershipSelected,
          account,
          isSubmitting,
          transactions,
          currentTxIdx: idx
        },
        actions: (_: MembershipSimpleTxFormFull, goToNextStep: () => void) => {
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
          onSuccess: (payload: ITxHash | ITxSigned) => sendTx(payload)
        }
      }
    ]),
    {
      label: translateRaw('PURCHASE_MEMBERSHIP_RECEIPT'),
      component: MembershipPurchaseReceipt,
      props: {
        account,
        transactions,
        membershipSelected
      }
    }
  ];

  return (
    <GeneralStepper
      onRender={goToNextStep => {
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
      defaultBackPath={ROUTE_PATHS.MYC_MEMBERSHIP.path}
      defaultBackPathLabel={ROUTE_PATHS.MYC_MEMBERSHIP.title} // ToDo: Change this.
    />
  );
};
export default PurchaseMembershipStepper;
