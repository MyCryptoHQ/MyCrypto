import { Token } from 'config/data';
import React from 'react';
import { TokenBalance } from 'selectors/wallet';
import translate from 'translations';
import AddCustomTokenForm from './AddCustomTokenForm';
import './index.scss';
import TokenRow from './TokenRow';

interface Props {
  tokens: TokenBalance[];
  onAddCustomToken(token: Token): any;
  onRemoveCustomToken(symbol: string): any;
}

interface State {
  showAllTokens: boolean;
  showCustomTokenForm: boolean;
}
export default class TokenBalances extends React.Component<Props, State> {
  public state = {
    showAllTokens: false,
    showCustomTokenForm: false
  };

  public render() {
    const { tokens } = this.props;
    const shownTokens = tokens.filter(
      token => !token.balance.eq(0) || token.custom || this.state.showAllTokens
    );

    return (
      <section className="TokenBalances">
        <h5 className="TokenBalances-title">{translate('sidebar_TokenBal')}</h5>
        <table className="TokenBalances-rows">
          <tbody>
            {shownTokens.map(token => (
              <TokenRow
                key={token.symbol}
                balance={token.balance}
                symbol={token.symbol}
                custom={token.custom}
                onRemove={this.props.onRemoveCustomToken}
              />
            ))}
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
            <span>{translate('SEND_custom')}</span>
          </button>
        </div>

        {this.state.showCustomTokenForm && (
          <div className="TokenBalances-form">
            <AddCustomTokenForm onSave={this.addCustomToken} />
          </div>
        )}
      </section>
    );
  }

  public toggleShowAllTokens = () => {
    this.setState(state => {
      return {
        showAllTokens: !state.showAllTokens
      };
    });
  };

  public toggleShowCustomTokenForm = () => {
    this.setState(state => {
      return {
        showCustomTokenForm: !state.showCustomTokenForm
      };
    });
  };

  public addCustomToken = (token: Token) => {
    this.props.onAddCustomToken(token);
    this.setState({ showCustomTokenForm: false });
  };
}
