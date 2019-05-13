import { FormDataAction, FormData, FormDataActionType as ActionType } from './types';


export const initialState: FormData = {
  network: 'Ethereum' // @ADD_ACCOUNT_TODO this should have the same type as networkOptions in NetworkOptionsContext
};

export const formReducer = (formData: FormData, action: FormDataAction) => {
  console.debug('REDUCER', action);
  switch (action.type) {
    case ActionType.SELECT_NETWORK:
      const { network } = action.payload;
      return { ...formData, network };
    case ActionType.SELECT_ACCOUNT:
      const { account } = action.payload;
      return { ...formData, account };
    case ActionType.SELECT_ACCOUNT_TYPE:
      const { accountType } = action.payload;
      return { ...formData, accountType };
    case ActionType.ON_UNLOCK:
      return { ...formData };
    case ActionType.SET_LABEL:
      const { label } = action.payload;
      return { ...formData, label };
    case ActionType.SET_DERIVATION_PATH:
      const { derivationPath } = action.payload;
      return { ...formData, derivationPath };
    case ActionType.RESET_FORM:
      return initialState;
    default:
      throw new Error(`[AddAccountReducer]: Type ${action.type} is not recognized by this reducer`);
  }
};
