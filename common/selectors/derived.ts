import { AppState } from 'reducers';
import { getWalletType } from 'selectors/wallet';
import { getOffline, getForceOffline } from 'selectors/config';

export const isAnyOfflineWithWeb3 = (state: AppState): boolean => {
  const { isWeb3Wallet } = getWalletType(state);
  const offline = getOffline(state);
  const forceOffline = getForceOffline(state);
  const anyOffline = offline || forceOffline;
  const anyOfflineAndWeb3 = anyOffline && isWeb3Wallet;
  return anyOfflineAndWeb3;
};
