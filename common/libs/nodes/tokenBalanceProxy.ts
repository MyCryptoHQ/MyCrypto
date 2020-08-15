import { Token } from 'shared/types/network';
import ERC20 from 'libs/erc20';
import { TokenValue } from 'libs/units';
import { IProvider } from 'mycrypto-shepherd/dist/lib/types';
import { getTokensBalance } from '@mycrypto/eth-scan';

export const tokenBalanceHandler: ProxyHandler<IProvider> = {
  get(target, propKey) {
    const tokenBalanceShim = (address: string, token: Token) => {
      const sendCallRequest: (...rpcArgs: any[]) => Promise<string> = Reflect.get(
        target,
        'sendCallRequest'
      );
      return sendCallRequest({
        to: token.address,
        data: ERC20.balanceOf.encodeInput({ _owner: address })
      })
        .then(result => ({ balance: TokenValue(result), error: null }))
        .catch(err => ({
          balance: TokenValue('0'),
          error: `Caught error: ${err}`
        }));
    };

    if (propKey.toString() === 'getTokenBalance') {
      return (address: string, token: Token) => tokenBalanceShim(address, token);
    } else if (propKey.toString() === 'getTokenBalances') {
      return (address: string, tokens: Token[]) =>
        getTokensBalance(target, address, tokens.map(token => token.address)).then(results => {
          return Object.entries(results).map(([, balance]) => {
            return {
              balance: TokenValue(balance.toHexString()),
              error: null
            };
          });
        });
    } else {
      return Reflect.get(target, propKey);
    }
  }
};
