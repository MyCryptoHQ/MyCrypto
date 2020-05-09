import { DEFAULT_NETWORK } from '@config';
import { FormData, WalletId } from '@types';
import { FormDataAction, FormDataActionType as ActionType } from './types';

export const initialState: FormData = {
  network: DEFAULT_NETWORK,
  accountType: undefined,
  address: '',
  label: 'New Account',
  derivationPath: ''
};

export const formReducer = (formData: FormData, action: FormDataAction) => {
  switch (action.type) {
    case ActionType.SELECT_NETWORK:
      const { network } = action.payload;
      return { ...formData, network };
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

const handleUnlock = (walletType: WalletId | undefined, payload: any) => {
  switch (walletType) {
    case WalletId.VIEW_ONLY:
    case WalletId.KEYSTORE_FILE:
    case WalletId.PRIVATE_KEY:
    case WalletId.WEB3:
      return {
        address: payload.getAddressString(),
        derivationPath: ''
      };
    case WalletId.WALLETCONNECT:
      return {
        address: payload.address,
        derivationPath: ''
      };
    case WalletId.MNEMONIC_PHRASE:
    case WalletId.LEDGER_NANO_S:
    case WalletId.TREZOR:
      return {
        address: payload.address,
        derivationPath: payload.path || payload.dPath + '/' + payload.index.toString()
      };
    default:
      throw new Error(
        `[AddAccountReducer]: UNLOCK with wallet ${walletType} and payload ${payload} is invalid`
      );
  }
};
