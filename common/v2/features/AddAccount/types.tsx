export enum WalletType {
  SECURE,
  INSECURE,
  MISC
}

// @ADD_ACCOUNT_TODO: move to named enum or other Set
export enum WalletName {
  DEFAULT,
  WEB3PROVIDER,
  LEDGER,
  TREZOR,
  SAFE_T,
  PARITY_SIGNER,
  KEYSTORE_FILE,
  MNEMONIC_PHRASE,
  PRIVATE_KEY,
  VIEW_ONLY
}

// @ADD_ACCOUNT_TODO: move to named enum or other Set
export enum FormDataActionType {
  SELECT_NETWORK,
  SELECT_ACCOUNT,
  SELECT_ACCOUNT_TYPE,
  SET_LABEL,
  SET_DERIVATION_PATH,
  RESET_FORM
}

export interface FormDataAction {
  type: FormDataActionType;
  payload: any;
}

export interface FormData {
  network: string;
  account: string;
  accountType: string;
  label: string;
  derivationPath: string;
}
