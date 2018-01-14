import { AppState } from 'reducers';
import { getWalletType } from 'selectors/wallet';
import { getOffline } from 'selectors/config';

export const isAnyOfflineWithWeb3 = (state: AppState): boolean => {
  const { isWeb3Wallet } = getWalletType(state);
  const offline = getOffline(state);
  return offline && isWeb3Wallet;
};
