import { apply, select } from 'redux-saga/effects';
import { getNodeLib } from 'selectors/config';
import { Token } from 'config/data';
import { INode } from 'libs/nodes/INode';
import { IWallet } from 'libs/wallet';

export function* getTokenBalances(wallet: IWallet, tokens: Token[]) {
  const node: INode = yield select(getNodeLib);
  const address = yield apply(wallet, wallet.getAddressString);
  const tokenBalances = yield apply(node, node.getTokenBalances, [address, tokens]);
  return tokens.reduce((acc, t, i) => {
    acc[t.symbol] = tokenBalances[i];
    return acc;
  }, {});
}
