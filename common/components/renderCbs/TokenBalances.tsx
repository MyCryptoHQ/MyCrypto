import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getTokenBalances, TokenBalance } from 'selectors/wallet';

interface Props {
  tokens: TokenBalance[];
  withTokens({ tokens }: { tokens: TokenBalance[] }): React.ReactElement<any>;
}

class TokenBalancesClass extends React.Component<Props, {}> {
  public render() {
    const { tokens, withTokens } = this.props;
    return withTokens({ tokens });
  }
}

export const TokenBalances = connect((state: AppState) => ({
  tokens: getTokenBalances(state)
}))(TokenBalancesClass);
