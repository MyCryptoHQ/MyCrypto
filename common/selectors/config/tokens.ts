import { AppState } from 'reducers';
import { getUnit } from 'selectors/transaction/meta';
import { SHAPESHIFT_TOKEN_WHITELIST } from 'api/shapeshift';
import { getStaticNetworkConfig, isNetworkUnit } from 'selectors/config';
import { Token } from 'types/network';

export function getNetworkTokens(state: AppState): Token[] {
  const network = getStaticNetworkConfig(state);
  return network ? network.tokens : [];
}

export function getAllTokens(state: AppState): Token[] {
  const networkTokens = getNetworkTokens(state);
  return networkTokens.concat(state.customTokens);
}

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

export function tokenExists(state: AppState, token: string): boolean {
  const existInWhitelist = SHAPESHIFT_TOKEN_WHITELIST.includes(token);
  const existsInNetwork = !!getAllTokens(state).find(t => t.symbol === token);
  return existsInNetwork || existInWhitelist;
}

export function isSupportedUnit(state: AppState, unit: string) {
  const isToken: boolean = tokenExists(state, unit);
  const isEther: boolean = isNetworkUnit(state, unit);
  if (!isToken && !isEther) {
    return false;
  }
  return true;
}
