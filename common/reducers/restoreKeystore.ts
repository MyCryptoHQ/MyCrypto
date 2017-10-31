import { RestoreKeystoreFromWalletAction } from 'actions/restoreKeystore';
import { TypeKeys } from 'actions/restoreKeystore/constants';
import { UtcKeystore } from 'libs/keystore';

export interface State {
  activeStep: string;
  keystoreFile: Promise<UtcKeystore> | null | undefined;
}

export const INTITIAL_STATE: State = {
  activeStep: 'password',
  keystoreFile: null
};

export function restoreKeystore(
  state: State = INTITIAL_STATE,
  action: RestoreKeystoreFromWalletAction
): State {
  switch (action.type) {
    case TypeKeys.RESTORE_KEYSTORE_INSTANTIATE_WALLET: {
      return {
        ...state,
        keystoreFile: action.keystoreFile,
        activeStep: 'download'
      };
    }
    default:
      return state;
  }
}
