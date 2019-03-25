import { Token } from 'shared/types/network';
import ERC20 from 'libs/erc20';
import TokenScanner from 'libs/tokens/scannerContract';
import { TokenValue } from 'libs/units';
import { getShepherdNetwork } from 'libs/nodes';
import { IProvider } from 'mycrypto-shepherd/dist/lib/types';
import scannerConfig from 'libs/tokens/scannerConfig';
import scannerBlacklist from 'libs/tokens/scannerBlacklist';
import { sha3 as keccak256 } from 'ethereumjs-util';

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
      const batchSize = 400;
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
      const network = getShepherdNetwork();
      const scannerContract = scannerConfig.find(entry => entry.networks.includes(network));
      if (!scannerContract) {
        console.warn(`Warning: No token scanner contract deployed on current network (${network})`);
        return await slowTokenBalancesShim(address, tokens);
      } else {
        const getCode: (...rpcArgs: any[]) => Promise<string> = Reflect.get(
          target,
          'getCode'
        );
        const code = await getCode(scannerContract.address);
        const hash = keccak256(code).toString('hex');
        if (code === '0x') {
          console.warn(
            `Warning: Couldn't find token scanner contract (expected code at ${
              scannerContract.address
            } for network ${network})`
          );
          return await slowTokenBalancesShim(address, tokens);
        } else if (hash !== scannerContract.hash) {
          console.error(
            `Error: Token scanner contract hash mismatch (expected ${
              scannerContract.hash
            }; got ${hash})`
          );
          return await slowTokenBalancesShim(address, tokens);
        } else {
          const sendCallRequest: (...rpcArgs: any[]) => Promise<string[]> = Reflect.get(
            target,
            'sendCallRequest'
          );
          const contracts = tokens.map(token => {
            const { address } = token;
            const blacklisted = scannerBlacklist.find(
              entry => entry.networks.includes(network) && entry.address === address
            );
            if (blacklisted) {
              return '0x0000000000000000000000000000000000000000';
            } else {
              return address;
            }
          });
          const response = await sendCallRequest({
            to: scannerContract.address,
            data: TokenScanner.scanTokens.encodeInput({
              _owner: address,
              _contracts: contracts
            })
          });

          const balances = TokenScanner.scanTokens.decodeOutput(response)[0];
          if (balances.length === 0) {
            if (tokens.length > 1) {
              console.warn(
                `Token scanner failed; splitting up batch... (contained ${tokens.length} tokens)`
              );
              return [
                ...(await tokenBalancesShim(
                  address,
                  tokens.splice(0, Math.ceil(tokens.length / 2))
                )),
                ...(await tokenBalancesShim(address, tokens))
              ];
            } else if (tokens.length === 1) {
              console.warn(
                `Warning: Invalid or selfdestructed ERC20 contract: ${tokens[0].address}`
              );
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
