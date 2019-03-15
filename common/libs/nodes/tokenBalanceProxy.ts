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

    const tokenBalancesShim = async (address: string, tokens: Token[]) => {
      const sendCallRequest: (...rpcArgs: any[]) => Promise<string[]> = Reflect.get(
        target,
        'sendCallRequest'
      );
      const response = await sendCallRequest({
        to: '0x657bEdAFb6BddbEDB8F930d7f91a5AF765B42Ba2',
        data: TokenScanner.scanTokens.encodeInput({
          _address: address,
          _contracts: tokens.map(token => token.address)
        })
      });

      const balances = TokenScanner.scanTokens.decodeOutput(response)[0];
      if (
        tokens.map(token => token.address).includes('0xdb455c71C1bC2de4e80cA451184041Ef32054001')
      ) {
        console.log(tokens.map(token => token.address));
        console.log(balances);
      }
      return balances.map((balance: any) => {
        if (balance) {
          return {
            balance,
            error: null
          };
        } else {
          return {
            balance: TokenValue('0'),
            error: 'Invalid object shape'
          };
        }
      });
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
