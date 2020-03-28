import React, { useEffect } from 'react';
import { useStateReducer, useTxMulti } from 'v2/utils';
import { ITxReceipt, ITxConfig, TxParcel, ITxSigned, ITxHash } from 'v2/types';
import { default as GeneralStepper, IStepperPath } from 'v2/components/GeneralStepper';
import { ROUTE_PATHS } from 'v2/config';

import { defaultMembershipObject } from './config';
import {
  MembershipPurchaseForm,
  MembershipPurchaseReceipt,
  ConfirmMembershipPurchase,
  ConfirmMembershipPurchaseMultiTx
} from './components';
import MembershipInteractionFactory from './stateFactory';
import { MembershipSimpleTxFormFull, MembershipPurchaseState } from './types';
import { translateRaw } from 'v2/translations';
import { WALLET_STEPS } from 'v2/components';
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
  const { account }: MembershipPurchaseState = purchaseMembershipFlowState;

  const steps: IStepperPath[] = [
    {
      label: 'Purchase Membership',
      component: MembershipPurchaseForm,
      props: (s => s)(purchaseMembershipFlowState),
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
        label: translateRaw('SWAP_CONFIRM_TITLE'),
        backBtnText: translateRaw('SWAP'),
        component:
          transactions.length > 1 ? ConfirmMembershipPurchaseMultiTx : ConfirmMembershipPurchase,
        props: {
          account,
          isSubmitting,
          transactions,
          currentTxIdx: idx
        },
        actions: {
          onClick: () => {
            prepareTx(tx.txRaw);
          }
        }
      },
      {
        label: translateRaw('SWAP'),
        backBtnText: translateRaw('SWAP_CONFIRM_TITLE'),
        component: account && WALLET_STEPS[account.wallet],
        props: {
          network: account && account.network,
          senderAccount: account,
          rawTransaction: tx.txRaw
        },
        actions: {
          onSuccess: (payload: ITxHash | ITxSigned) => sendTx(payload)
        }
      }
    ]),
    {
      label: 'Membership Purchase Receipt',
      component: MembershipPurchaseReceipt,
      props: (({ membershipSelected }) => ({
        transactions,
        membershipSelected
      }))(purchaseMembershipFlowState)
    }
  ];

  return (
    <GeneralStepper
      onRender={goToNextStep => {
        useEffect(() => {
          if (!canYield) return;
          goToNextStep();
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
