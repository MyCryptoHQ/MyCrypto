// @flow
import React from 'react';
import translate from 'translations';
import TokenRow from './TokenRow';
import AddCustomTokenForm from './AddCustomTokenForm';
import type { TokenBalance } from 'selectors/wallet';
import type { Token } from 'config/data';

type Props = {
  tokens: TokenBalance[],
  onAddCustomToken: (token: Token) => any,
  onRemoveCustomToken: (symbol: string) => any
};

export default class TokenBalances extends React.Component {
  props: Props;
  state = {
    showAllTokens: false,
    showCustomTokenForm: false
  };

  render() {
    const { tokens } = this.props;
    return (
      <section className="token-balances">
        <h5>{translate('sidebar_TokenBal')}</h5>
        <table className="account-info">
          <tbody>
            {tokens
              .filter(token => !token.balance.eq(0) || token.custom || this.state.showAllTokens)
              .map(token =>
                <TokenRow
                  key={token.symbol}
                  balance={token.balance}
                  symbol={token.symbol}
                  custom={token.custom}
                  onRemove={this.props.onRemoveCustomToken}
                />
              )}
          </tbody>
        </table>
        <a className="btn btn-default btn-sm" onClick={this.toggleShowAllTokens}>
          {!this.state.showAllTokens ? 'Show All Tokens' : 'Hide Tokens'}
        </a>{' '}
        <a className="btn btn-default btn-sm" onClick={this.toggleShowCustomTokenForm}>
          <span>
            {translate('SEND_custom')}
          </span>
        </a>
        {this.state.showCustomTokenForm && <AddCustomTokenForm onSave={this.addCustomToken} />}
      </section>
    );
  }

  toggleShowAllTokens = () => {
    this.setState(state => {
      return {
        showAllTokens: !state.showAllTokens
      };
    });
  };

  toggleShowCustomTokenForm = () => {
    this.setState(state => {
      return {
        showCustomTokenForm: !state.showCustomTokenForm
      };
    });
  };

  addCustomToken = (token: Token) => {
    this.props.onAddCustomToken(token);
    this.setState({ showCustomTokenForm: false });
  };
}
