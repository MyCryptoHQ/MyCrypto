import React, { useEffect } from 'react';

import { WALLET_STEPS } from '@components';
import { default as GeneralStepper, IStepperPath } from '@components/GeneralStepper';
import { ROUTE_PATHS } from '@config';
import { translateRaw } from '@translations';
import { ITxConfig, ITxReceipt, ITxStatus, TxParcel } from '@types';
import { useStateReducer, useTxMulti } from '@utils';

import { isERC20Asset } from '../SendAssets';
import ConfirmMembershipPurchase from './components/ConfirmMembershipPurchase';
import ConfirmMembershipPurchaseMultiTx from './components/ConfirmMembershipPurchaseMultiTx';
import MembershipPurchaseForm from './components/MembershipPurchaseForm';
import MembershipPurchaseReceipt from './components/MembershipPurchaseReceipt';
import { defaultMembershipObject } from './config';
import { createApproveTx, createPurchaseTx } from './helpers';
import MembershipInteractionFactory from './stateFactory';
import { MembershipPurchaseState, MembershipSimpleTxFormFull } from './types';

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
              isERC20Asset(formData.asset) ? [approveTx, purchaseTx] : [purchaseTx]
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
          onSuccess: sendTx
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
      defaultBackPath={ROUTE_PATHS.MYC_MEMBERSHIP.path}
      defaultBackPathLabel={ROUTE_PATHS.MYC_MEMBERSHIP.title} // @todo: Change this.
    />
  );
};
export default PurchaseMembershipStepper;
