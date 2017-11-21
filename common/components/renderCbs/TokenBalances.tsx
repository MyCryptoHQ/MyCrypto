import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getTokenBalances, TokenBalance } from 'selectors/wallet';

interface Props {
  tokens: TokenBalance[];
  nonZeroBalances?: boolean;
  withTokens({
    tokens
  }: {
    tokens: TokenBalance[];
  }): React.ReactElement<any> | null;
}

class TokenBalancesClass extends React.Component<Props, {}> {
  public render() {
    const { tokens, withTokens, nonZeroBalances } = this.props;
    return nonZeroBalances
      ? withTokens({ tokens: this.getNonZeroBalanceTokens(tokens) })
      : withTokens({ tokens });
  }

  private getNonZeroBalanceTokens = (tokens: TokenBalance[]) =>
    tokens.filter(t => !t.balance.isZero());
}

export const TokenBalances = connect((state: AppState) => ({
  tokens: getTokenBalances(state)
}))(TokenBalancesClass);
