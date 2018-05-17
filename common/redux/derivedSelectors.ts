import { AppState } from './reducers';
import { getWalletType } from './wallet/selectors';
import { getOffline } from './config/selectors';

export const isAnyOfflineWithWeb3 = (state: AppState): boolean => {
  const { isWeb3Wallet } = getWalletType(state);
  const offline = getOffline(state);
  return offline && isWeb3Wallet;
};
