import React from 'react';
import { useStateReducer } from 'v2/utils';
import { ITxReceipt, ISignedTx, ITxConfig } from 'v2/types';
import { default as GeneralStepper, IStepperPath } from 'v2/components/GeneralStepper';
import { ROUTE_PATHS } from 'v2/config';

import { defaultMembershipObject } from './config';
import {
  MembershipPurchaseForm,
  MembershipPurchaseReceipt,
  ConfirmMembershipPurchase
} from './components';
import MembershipInteractionFactory from './stateFactory';
import { SignTransaction } from '../SendAssets/components';
import { ISimpleTxFormFull } from './types';

const initialMembershipFlowState = {
  membershipSelected: defaultMembershipObject,
  txConfig: (undefined as unknown) as ITxConfig,
  txReceipt: (undefined as unknown) as ITxReceipt
};

const PurchaseMembershipStepper = () => {
  const {
    purchaseMembershipFlowState,
    handleUserInputFormSubmit,
    handleTxSigned
  } = useStateReducer(MembershipInteractionFactory, initialMembershipFlowState);

  const steps: IStepperPath[] = [
    {
      label: 'Purchase Membership',
      component: MembershipPurchaseForm,
      props: (state => state)(purchaseMembershipFlowState),
      actions: (formData: ISimpleTxFormFull, cb: any) => handleUserInputFormSubmit(formData, cb)
    },
    {
      label: 'Confirm Transaction',
      component: ConfirmMembershipPurchase,
      props: (({ txConfig }) => ({ txConfig }))(purchaseMembershipFlowState)
    },
    {
      label: '',
      component: SignTransaction,
      props: (({ txConfig }) => ({ txConfig }))(purchaseMembershipFlowState),
      actions: (payload: ITxReceipt | ISignedTx, cb: any) => handleTxSigned(payload, cb)
    },
    {
      label: 'Membership Purchase Receipt',
      component: MembershipPurchaseReceipt,
      props: (({ txConfig, txReceipt }) => ({ txConfig, txReceipt }))(purchaseMembershipFlowState)
    }
  ];
  return (
    <GeneralStepper
      steps={steps}
      defaultBackPath={ROUTE_PATHS.MYC_MEMBERSHIP.path}
      defaultBackPathLabel={ROUTE_PATHS.MYC_MEMBERSHIP.title} // ToDo: Change this.
    />
  );
};
export default PurchaseMembershipStepper;
