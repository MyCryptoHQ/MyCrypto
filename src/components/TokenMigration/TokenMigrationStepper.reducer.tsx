import { ValuesType } from 'utility-types';

import { TAction, TokenMigrationState } from '@types';

export type ReducerAction = TAction<ValuesType<typeof tokenMigrationReducer.actionTypes>, any>;

export const tokenMigrationReducer = (
  state: TokenMigrationState,
  action: ReducerAction
): TokenMigrationState => {
  switch (action.type) {
    case tokenMigrationReducer.actionTypes.FORM_SUBMIT: {
      const { account, amount } = action.payload;
      return { ...state, account, amount };
    }

    default:
      return state;
  }
};

tokenMigrationReducer.actionTypes = {
  FORM_SUBMIT: 'FORM_SUBMIT'
};
