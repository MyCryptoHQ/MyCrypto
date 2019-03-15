import { Token } from 'shared/types/network';
import ERC20 from 'libs/erc20';
import TokenScanner from 'libs/tokens/scanner';
import { TokenValue } from 'libs/units';
import { IProvider } from 'mycrypto-shepherd/dist/lib/types';

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

    const splitBatches = (address: string, tokens: Token[]) => {
      const batchSize = 200;
      type SplitBatch = { address: string; tokens: Token[] }[];
      const splitBatch: SplitBatch = [];
      for (let i = 0; i < tokens.length; i++) {
        const arrIdx = Math.ceil((i + 1) / batchSize) - 1;
        const token = tokens[i];

        if (!splitBatch[arrIdx]) {
          splitBatch.push({ address, tokens: [token] });
        } else {
          splitBatch[arrIdx] = { address, tokens: [...splitBatch[arrIdx].tokens, token] };
        }
      }
      return splitBatch;
    };

    const tokenBalancesShim = async (address: string, tokens: Token[]): Promise<any> => {
      if (false) {
        return await slowTokenBalancesShim(address, tokens);
      } else {
        const sendCallRequest: (...rpcArgs: any[]) => Promise<string[]> = Reflect.get(
          target,
          'sendCallRequest'
        );
        const response = await sendCallRequest({
          to: '0x657bEdAFb6BddbEDB8F930d7f91a5AF765B42Ba2',
          data: TokenScanner.scanTokens.encodeInput({
            _owner: address,
            _contracts: tokens.map(token => token.address)
          })
        });

        const balances = TokenScanner.scanTokens.decodeOutput(response)[0];
        if (balances.length === 0) {
          if (tokens.length > 1) {
            return [
              ...(await tokenBalancesShim(address, tokens.splice(0, Math.ceil(tokens.length / 2)))),
              ...(await tokenBalancesShim(address, tokens))
            ];
          } else if (tokens.length === 1) {
            console.error('Broken ERC20 contract: ' + tokens[0].address);
            return [
              {
                balance: TokenValue('0'),
                error: 'Invalid object shape'
              }
            ];
          }
        } else {
          return balances.map((balance: any) => ({
            balance,
            error: null
          }));
        }
      }
    };

    const slowTokenBalancesShim = async (address: string, tokens: Token[]): Promise<any> => {
      const sendCallRequests: (...rpcArgs: any[]) => Promise<string[]> = Reflect.get(
        target,
        'sendCallRequests'
      );
      return sendCallRequests(
        tokens.map(t => ({
          to: t.address,
          data: ERC20.balanceOf.encodeInput({ _owner: address })
        }))
      ).then(response =>
        response.map(item => {
          if (item) {
            return {
              balance: TokenValue(item),
              error: null
            };
          } else {
            return {
              balance: TokenValue('0'),
              error: 'Invalid object shape'
            };
          }
        })
      );
    };

    if (propKey.toString() === 'getTokenBalance') {
      return (address: string, token: Token) => tokenBalanceShim(address, token);
    } else if (propKey.toString() === 'getTokenBalances') {
      return (address: string, tokens: Token[]) =>
        Promise.all(
          splitBatches(address, tokens).map(({ address: addr, tokens: tkns }) =>
            tokenBalancesShim(addr, tkns)
          )
        ).then(res => res.reduce((acc, curr) => [...acc, ...curr], []));
    } else {
      return Reflect.get(target, propKey);
    }
  }
};
