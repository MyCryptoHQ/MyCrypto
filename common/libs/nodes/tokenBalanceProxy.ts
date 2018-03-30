import { Token } from 'shared/types/network';
import ERC20 from 'libs/erc20';
import { TokenValue } from 'libs/units';

export const tokenBalanceHandler: ProxyHandler<any> = {
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
          error: 'Caught error:' + err
        }));
    };

    if (propKey.toString() === 'getTokenBalance') {
      return (address: string, token: Token) => tokenBalanceShim(address, token);
    } else if (propKey.toString() === 'getTokenBalances') {
      return (address: string, tokens: Token[]) =>
        Promise.all(tokens.map(t => tokenBalanceShim(address, t)));
    } else {
      return Reflect.get(target, propKey);
    }
  }
};
