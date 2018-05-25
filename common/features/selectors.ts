import { AppState } from './reducers';
import { getWalletType } from './wallet';
import { getAllTokens, isNetworkUnit, getOffline } from './config';
import { getUnit } from './transaction/selectors';

export const isAnyOfflineWithWeb3 = (state: AppState): boolean => {
  const { isWeb3Wallet } = getWalletType(state);
  const offline = getOffline(state);
  return offline && isWeb3Wallet;
};

export function getSelectedTokenContractAddress(state: AppState): string {
  const allTokens = getAllTokens(state);
  const currentUnit = getUnit(state);

  if (isNetworkUnit(state, currentUnit)) {
    return '';
  }

  return allTokens.reduce((tokenAddr, tokenInfo) => {
    if (tokenAddr && tokenAddr.length) {
      return tokenAddr;
    }

    if (tokenInfo.symbol === currentUnit) {
      return tokenInfo.address;
    }

    return tokenAddr;
  }, '');
}
