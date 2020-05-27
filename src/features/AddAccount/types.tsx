// @ADD_ACCOUNT_@todo: move to named enum or other Set
export enum FormDataActionType {
  SELECT_NETWORK,
  SELECT_ACCOUNT,
  SELECT_ACCOUNT_TYPE,
  SET_LABEL,
  SET_DERIVATION_PATH,
  ON_UNLOCK,
  RESET_FORM
}

export interface FormDataAction {
  type: FormDataActionType;
  payload: any;
}
