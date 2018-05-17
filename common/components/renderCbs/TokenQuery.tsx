import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import { getTokens, MergedToken } from 'features/wallet/selectors';
import { Query } from './Query';

interface Props {
  tokens: MergedToken[];
  withQuery({ token }: { token: MergedToken | null | undefined }): React.ReactElement<any>;
}

class TokenQueryClass extends Component<Props, {}> {
  public render() {
    return (
      <Query
        params={['tokenSymbol']}
        withQuery={({ tokenSymbol }) => this.props.withQuery(this.paramGetter(tokenSymbol))}
      />
    );
  }
  private paramGetter = (unit: string | null) =>
    unit ? { token: this.props.tokens.find(t => t.symbol === unit) } : { token: null };
}

export const TokenQuery = connect((state: AppState) => ({
  tokens: getTokens(state)
}))(TokenQueryClass);
