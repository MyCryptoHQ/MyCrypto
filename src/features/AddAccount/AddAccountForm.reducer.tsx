import { DEFAULT_NETWORK } from '@config';
import { FormData, IAccountAdditionData, WalletId } from '@types';

import { FormDataActionType as ActionType, FormDataAction } from './types';

export const initialState: FormData = {
  network: DEFAULT_NETWORK,
  accountType: undefined,
  accountData: [] as IAccountAdditionData[],
  label: 'New Account'
};

export const formReducer = (formData: FormData, action: FormDataAction) => {
  switch (action.type) {
    case ActionType.SELECT_NETWORK:
      return { ...formData, network: action.payload.network };
    case ActionType.SELECT_ACCOUNT_TYPE:
      return { ...formData, accountType: action.payload.accountType };
    case ActionType.ON_UNLOCK:
      return { ...formData, accountData: handleUnlock(formData.accountType, action.payload) };
    case ActionType.SET_LABEL:
      return { ...formData, label: action.payload.label };
    case ActionType.SET_DERIVATION_PATH:
      return { ...formData, derivationPath: action.payload.derivationPath };
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
      case WalletId.WEB3:
        return payload.map((payloadItem: any) => ({
          address: payloadItem.getAddress(),
          derivationPath: ''
        }));
      case WalletId.WALLETCONNECT:
        return [
          {
            address: payload.address,
            derivationPath: ''
          }
        ];
      case WalletId.LEDGER_NANO_S:
        return [
          {
            address: payload.address,
            dPath: payload.getPath()
          }
        ];
      case WalletId.TREZOR:
        return [
          {
            address: payload.address,
            derivationPath: payload.path || payload.dPath + '/' + payload.index.toString()
          }
        ];
      case WalletId.LEDGER_NANO_S_NEW:
      case WalletId.TREZOR_NEW:
      case WalletId.GRIDPLUS:
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
