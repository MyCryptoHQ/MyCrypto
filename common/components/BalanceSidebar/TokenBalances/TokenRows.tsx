import React from 'react';
import { TokenBalance } from 'selectors/wallet';
import TokenRow from './TokenRow';

interface Props {
  tokens: TokenBalance[];
  onRemoveCustomToken(symbol: string): any;
}

export default class TokenRows extends React.Component<Props, {}> {
  public render() {
    const { tokens } = this.props;

    return (
      <table className="TokenBalances-rows">
        <tbody>
          {tokens.map(token => (
            <TokenRow
              key={token.symbol}
              balance={token.balance}
              symbol={token.symbol}
              custom={token.custom}
              decimal={token.decimal}
              onRemove={this.props.onRemoveCustomToken}
            />
          ))}
        </tbody>
      </table>
    );
  }
}
