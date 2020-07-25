import { DEFAULT_NETWORK } from '@config';
import { FormData, WalletId, IAccountAdditionData } from '@types';
import { FormDataAction, FormDataActionType as ActionType } from './types';

export const initialState: FormData = {
  network: DEFAULT_NETWORK,
  accountType: undefined,
  accountData: [] as IAccountAdditionData[],
  label: 'New Account'
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
      const accountWithDPath = handleUnlock(formData.accountType, action.payload);
      return { ...formData, accountData: accountWithDPath };
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
  const wallets = (() => {
    switch (walletType) {
      case WalletId.VIEW_ONLY:
        return [payload];
      case WalletId.KEYSTORE_FILE:
        return [payload];
      case WalletId.PRIVATE_KEY:
        return [payload];
      case WalletId.WEB3:
        return [
          {
            address: payload.getAddressString(),
            derivationPath: ''
          }
        ];
      case WalletId.WALLETCONNECT:
        return [
          {
            address: payload.address,
            derivationPath: ''
          }
        ];
      case WalletId.MNEMONIC_PHRASE:
        return [payload];
      case WalletId.MNEMONIC_PHRASE_NEW:
        return payload;
      case WalletId.LEDGER_NANO_S:
        return [payload];
      case WalletId.LEDGER_NANO_S_NEW:
        return payload;
      case WalletId.TREZOR:
        return [
          {
            address: payload.address,
            derivationPath: payload.path || payload.dPath + '/' + payload.index.toString()
          }
        ];

      case WalletId.TREZOR_NEW:
        return payload;
      default:
        throw new Error(
          `[AddAccountReducer]: UNLOCK with wallet ${walletType} and payload ${payload} is invalid`
        );
    }
  })();
  return wallets.map((a: any) => ({
    ...a,
    dPath: a.derivationPath || a.dPath
  })) as IAccountAdditionData[];
};
