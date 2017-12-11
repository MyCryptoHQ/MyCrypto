import { apply, select, call } from 'redux-saga/effects';
import { AppState } from 'reducers';
import { Token } from 'config/data';
import { INode } from 'libs/nodes/INode';
import { IWallet, WalletConfig } from 'libs/wallet';
import { TokenBalance } from 'selectors/wallet';
import { getCustomTokens } from 'selectors/customTokens';
import { getNodeLib } from 'selectors/config';
import { loadWalletConfig } from 'utils/localStorage';
import { TokenBalanceLookup } from './wallet';

export function* getTokenBalances(wallet: IWallet, tokens: Token[]) {
  const node: INode = yield select(getNodeLib);
  const address: string = yield apply(wallet, wallet.getAddressString);
  const tokenBalances: TokenBalance[] = yield apply(node, node.getTokenBalances, [address, tokens]);
  return tokens.reduce((acc, t, i) => {
    acc[t.symbol] = tokenBalances[i];
    return acc;
  }, {});
}

// Return an array of the tokens that meet any of the following conditions:
//  1. Non-zero balance
//  2. It was in the previous wallet's config
//  3. It's a custom token that the user added
export function* filterScannedTokenBalances(wallet: IWallet, balances: TokenBalanceLookup) {
  const customTokens: AppState['customTokens'] = yield select(getCustomTokens);
  const oldConfig: WalletConfig = yield call(loadWalletConfig, wallet);
  return Object.keys(balances).filter(symbol => {
    if (balances[symbol] && !balances[symbol].balance.isZero()) {
      return true;
    }
    if (oldConfig.tokens && oldConfig.tokens.includes(symbol)) {
      return true;
    }
    if (customTokens.find(token => token.symbol === symbol)) {
      return true;
    }
  });
}
