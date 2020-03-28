
import { TUseStateReducerFactory } from 'v2/utils';
import { MembershipPurchaseState, TStepAction, MembershipSimpleTxFormFull } from './types';
const MembershipPurchaseFactory: TUseStateReducerFactory<MembershipPurchaseState> = ({
  state,
  setState
}) => {
  const handleUserInputFormSubmit: TStepAction = (
    payload: MembershipSimpleTxFormFull
  ) => {
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
