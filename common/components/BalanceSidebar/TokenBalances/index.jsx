// @flow
import './index.scss';
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
    const shownTokens = tokens.filter(
      token => !token.balance.eq(0) || token.custom || this.state.showAllTokens
    );

    return (
      <section className="TokenBalances">
        <h5 className="TokenBalances-title">
          {translate('sidebar_TokenBal')}
        </h5>
        <table className="TokenBalances-rows">
          <tbody>
            {shownTokens.map(token =>
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

        <div className="TokenBalances-buttons">
          <button
            className="btn btn-default btn-xs"
            onClick={this.toggleShowAllTokens}
          >
            {!this.state.showAllTokens ? 'Show All Tokens' : 'Hide Tokens'}
          </button>{' '}
          <button
            className="btn btn-default btn-xs"
            onClick={this.toggleShowCustomTokenForm}
          >
            <span>
              {translate('SEND_custom')}
            </span>
          </button>
        </div>

        {this.state.showCustomTokenForm &&
          <div className="TokenBalances-form">
            <AddCustomTokenForm onSave={this.addCustomToken} />
          </div>}
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
