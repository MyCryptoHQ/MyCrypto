import { DEFAULT_NETWORK } from 'v2/config';
import {
  WalletName,
  walletNames,
  InsecureWalletName,
  MiscWalletName,
  SecureWalletName
} from 'v2/types';
import { FormDataAction, FormData, FormDataActionType as ActionType } from './types';

export const initialState: FormData = {
  network: DEFAULT_NETWORK,
  accountType: walletNames.DEFAULT,
  account: '',
  label: 'New Account',
  derivationPath: ''
};

export const formReducer = (formData: FormData, action: FormDataAction) => {
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
      const accountAndDerivationPath = handleUnlock(formData.accountType, action.payload);
      return { ...formData, ...accountAndDerivationPath };
    case ActionType.SET_LABEL:
      const { label } = action.payload;
      return { ...formData, label };
    case ActionType.SET_DERIVATION_PATH:
      const { derivationPath } = action.payload;
      return { ...formData, derivationPath };
    case ActionType.RESET_FORM:
      return initialState;
    default:
      return formData;
  }
};

const handleUnlock = (walletType: WalletName, payload: any) => {
  switch (walletType) {
    case MiscWalletName.VIEW_ONLY:
    case InsecureWalletName.KEYSTORE_FILE:
    case InsecureWalletName.PRIVATE_KEY:
    case SecureWalletName.WEB3:
      return {
        account: payload.getAddressString(),
        derivationPath: ''
      };
    case SecureWalletName.PARITY_SIGNER:
      return {
        account: payload.address,
        derivationPath: ''
      };
    case InsecureWalletName.MNEMONIC_PHRASE:
    case SecureWalletName.LEDGER_NANO_S:
    case SecureWalletName.TREZOR:
    case SecureWalletName.SAFE_T:
      return {
        account: payload.address,
        derivationPath: payload.path || payload.dPath + '/' + payload.index.toString()
      };
    default:
      throw new Error(
        `[AddAccountReducer]: UNLOCK with wallet ${walletType} and payload ${payload} is invalid`
      );
  }
};
