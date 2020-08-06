import { TUseStateReducerFactory } from '@utils';
import { TokenMigrationState, TStepAction, ISimpleTxFormFull } from './types';
const TokenMigrationFactory: TUseStateReducerFactory<TokenMigrationState> = ({
  state,
  setState
}) => {
  const handleUserInputFormSubmit: TStepAction = (payload: ISimpleTxFormFull) => {
    const { account } = payload;

    setState({
      ...state,
      account
    });
  };

  return {
    handleUserInputFormSubmit,
    tokenMigrationFlowState: state
  };
};

export default TokenMigrationFactory;
