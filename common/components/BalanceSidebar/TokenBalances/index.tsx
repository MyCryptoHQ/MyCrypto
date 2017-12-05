import { Token } from 'config/data';
import React from 'react';
import { TokenBalance } from 'selectors/wallet';
import translate from 'translations';
import AddCustomTokenForm from './AddCustomTokenForm';
import TokenRows from './TokenRows';
import Spinner from 'components/ui/Spinner';
import './index.scss';

interface Props {
  tokens: TokenBalance[];
  isTokensLoading: boolean;
  tokensError: string | null;
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
    const { tokens, isTokensLoading, tokensError } = this.props;
    const shownTokens = tokens.filter(
      token => !token.balance.eqn(0) || token.custom || this.state.showAllTokens
    );

    let content;
    if (tokensError) {
      content = <h5>{tokensError}</h5>;
    } else if (isTokensLoading) {
      content = (
        <div className="TokenBalances-loader">
          <Spinner size="x3" />
        </div>
      );
    } else {
      content = (
        <div>
          <TokenRows tokens={shownTokens} onRemoveCustomToken={this.props.onRemoveCustomToken} />

          <div className="TokenBalances-buttons">
            <button className="btn btn-default btn-xs" onClick={this.toggleShowAllTokens}>
              {!this.state.showAllTokens ? 'Show All Tokens' : 'Hide Tokens'}
            </button>{' '}
            <button className="btn btn-default btn-xs" onClick={this.toggleShowCustomTokenForm}>
              <span>{translate('SEND_custom')}</span>
            </button>
          </div>

          {this.state.showCustomTokenForm && (
            <div className="TokenBalances-form">
              <AddCustomTokenForm onSave={this.addCustomToken} />
            </div>
          )}
        </div>
      );
    }

    return (
      <section className="TokenBalances">
        <h5 className="TokenBalances-title">{translate('sidebar_TokenBal')}</h5>
        {content}
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
