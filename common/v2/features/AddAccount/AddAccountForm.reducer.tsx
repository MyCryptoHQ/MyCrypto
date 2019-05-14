import { FormDataAction, FormData, FormDataActionType as ActionType, WalletName } from './types';

export const initialState: FormData = {
  network: 'Ethereum' // @ADD_ACCOUNT_TODO this should have the same type as networkOptions in NetworkOptionsContext
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

const handleUnlock = (walletType, payload) => {
  switch (walletType) {
    case WalletName.VIEW_ONLY:
    case WalletName.KEYSTORE_FILE:
    case WalletName.PRIVATE_KEY:
    case WalletName.WEB3PROVIDER:
      return {
        account: payload.getAddressString(),
        derivationPath: ''
      };
    case WalletName.PARITY_SIGNER:
      return {
        account: payload.address,
        derivationPath: ''
      };
    case WalletName.MNEMONIC_PHRASE:
    case WalletName.LEDGER:
    case WalletName.TREZOR:
    case WalletName.SAFE_T:
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
