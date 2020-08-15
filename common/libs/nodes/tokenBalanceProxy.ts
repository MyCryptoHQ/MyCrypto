import { Token } from 'shared/types/network';
import ERC20 from 'libs/erc20';
import { TokenValue } from 'libs/units';
import { IProvider } from 'mycrypto-shepherd/dist/lib/types';
import { getTokensBalance } from '@mycrypto/eth-scan';
import { getShepherdNetwork } from './index';

const ETH_SCAN_NETWORKS: string[] = ['ETH', 'Ropsten', 'Kovan', 'Rinkeby', 'Goerli'];

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
      const batchSize = 10;
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

    const tokenBalancesShim = (address: string, tokens: Token[]) => {
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
      const network = getShepherdNetwork();

      return (address: string, tokens: Token[]) => {
        if (ETH_SCAN_NETWORKS.includes(network)) {
          return getTokensBalance(target, address, tokens.map(token => token.address)).then(
            results => {
              return Object.entries(results).map(([, balance]) => {
                return {
                  balance: TokenValue(balance.toHexString()),
                  error: null
                };
              });
            }
          );
        }

        return Promise.all(
          splitBatches(address, tokens).map(({ address: addr, tokens: tkns }) =>
            tokenBalancesShim(addr, tkns)
          )
        ).then(res => res.reduce((acc, curr) => [...acc, ...curr], []));
      };
    } else {
      return Reflect.get(target, propKey);
    }
  }
};
