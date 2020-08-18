import { TUseStateReducerFactory } from '@utils';
import { ISimpleTxFormFull, TStepAction } from '@types';
import { TokenMigrationState } from './types';
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
