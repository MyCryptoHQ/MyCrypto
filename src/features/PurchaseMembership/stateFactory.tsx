import { TStepAction } from '@types';
import { TUseStateReducerFactory } from '@utils';

import { MembershipPurchaseState, MembershipSimpleTxFormFull } from './types';

const MembershipPurchaseFactory: TUseStateReducerFactory<MembershipPurchaseState> = ({
  state,
  setState
}) => {
  const handleUserInputFormSubmit: TStepAction = (payload: MembershipSimpleTxFormFull) => {
    const { membershipSelected, account } = payload;

    setState({
      ...state,
      account,
      membershipSelected
    });
  };

  return {
    handleUserInputFormSubmit,
    purchaseMembershipFlowState: state
  };
};

export default MembershipPurchaseFactory;
