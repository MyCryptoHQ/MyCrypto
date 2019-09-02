// @ADD_ACCOUNT_TODO: move to named enum or other Set
/*export enum WalletName {
  DEFAULT = 'WALLETLIST',
  WEB3PROVIDER = 'WEB3_PROVIDER',
  LEDGER = 'LEDGER',
  TREZOR = 'TREZOR',
  SAFE_T = 'SAFE_T',
  PARITY_SIGNER = 'PARITY_SIGNER',
  KEYSTORE_FILE = 'KEYSTORE_FILE',
  MNEMONIC_PHRASE = 'MNEMONIC_PHRASE',
  PRIVATE_KEY = 'PRIVATE_KEY',
  VIEW_ONLY = 'VIEW_ONLY'
}*/

// @ADD_ACCOUNT_TODO: move to named enum or other Set
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
