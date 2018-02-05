import React from 'react';
import translate from 'translations';
import { Token } from 'config/data';
import { TokenBalance } from 'selectors/wallet';
import AddCustomTokenForm from 'components/BalanceSidebar/TokenBalances/AddCustomTokenForm';
import TokenRow from 'components/BalanceSidebar/TokenBalances/TokenRow';
import SweepRow from './SweepRow';

interface Props {
  allTokens: Token[];
  tokenBalances: TokenBalance[];
  hasSavedWalletTokens: boolean;
  scanWalletForTokens(): any;
  setWalletTokens(tokens: string[]): any;
  onAddCustomToken(token: Token): any;
  onRemoveCustomToken(symbol: string): any;
}

interface State {
  trackedTokens: { [symbol: string]: boolean };
  tokensToSweep: { [symbol: string]: boolean };
  showCustomTokenForm: boolean;
  showTokenChecklist: boolean;
}
class SweeperList extends React.Component<Props, State> {
  public state = {
    trackedTokens: {},
    tokensToSweep: {},
    showCustomTokenForm: false,
    showTokenChecklist: false
  };

  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.tokenBalances !== this.props.tokenBalances) {
      const trackedTokens = nextProps.tokenBalances.reduce((prev, t) => {
        prev[t.symbol] = !t.balance.isZero();
        return prev;
      }, {});
      this.setState({ trackedTokens });
    }
  }

  public render() {
    const { allTokens, tokenBalances, hasSavedWalletTokens } = this.props;
    const { showCustomTokenForm, showTokenChecklist, trackedTokens, tokensToSweep } = this.state;

    let bottom;
    let help;
    const isEditingTokenList = !hasSavedWalletTokens || showTokenChecklist;

    if (tokenBalances.length && isEditingTokenList) {
      help = 'Select which tokens you would like to send';

      bottom = (
        <div className="TokenBalances-buttons">
          <button className="btn btn-primary btn-block" onClick={this.handleSetWalletTokens}>
            <span>{translate('x_Save')}</span>
          </button>
          <p className="TokenBalances-buttons-help">
            {translate('Missing tokens? You can add custom tokens next.')}
          </p>
        </div>
      );
    } else if (showCustomTokenForm) {
      bottom = (
        <div className="TokenBalances-form">
          <AddCustomTokenForm
            allTokens={allTokens}
            onSave={this.addCustomToken}
            toggleForm={this.toggleShowCustomTokenForm}
          />
        </div>
      );
    } else {
      bottom = (
        <div className="TokenBalances-buttons">
          <button className="btn btn-default btn-xs" onClick={this.toggleShowCustomTokenForm}>
            <span>{translate('SEND_custom')}</span>
          </button>{' '}
          <button className="btn btn-default btn-xs" onClick={this.editTokens}>
            <span>Edit Token List</span>
          </button>{' '}
          <button className="btn btn-default btn-xs" onClick={this.props.scanWalletForTokens}>
            <span>Scan for New Tokens</span>
          </button>
        </div>
      );
    }

    return (
      <div>
        {help && <p className="TokenBalances-help">{help}</p>}

        {isEditingTokenList &&
          tokenBalances.length && (
            <table className="TokenBalances-rows">
              <tbody>
                {tokenBalances.map(
                  token =>
                    token ? (
                      <TokenRow
                        key={token.symbol}
                        balance={token.balance}
                        symbol={token.symbol}
                        custom={token.custom}
                        decimal={token.decimal}
                        tracked={trackedTokens[token.symbol]}
                        toggleTracked={isEditingTokenList && this.toggleTrack}
                        onRemove={this.props.onRemoveCustomToken}
                      />
                    ) : null
                )}
              </tbody>
            </table>
          )}
        {!isEditingTokenList &&
          tokenBalances.length && (
            <table className="TokenBalances-rows">
              <tbody>
                <tr>
                  <th>Amount</th>
                  <th>Token Symbol</th>
                  <th>Transaction Sent</th>
                </tr>
                {tokenBalances.map(
                  token =>
                    token ? (
                      <SweepRow
                        key={token.symbol}
                        balance={token.balance}
                        symbol={token.symbol}
                        custom={token.custom}
                        decimal={token.decimal}
                        broadcasted={tokensToSweep[token.symbol]}
                        tracked={trackedTokens[token.symbol]}
                        toggleTracked={isEditingTokenList && this.toggleTrack}
                        onRemove={this.props.onRemoveCustomToken}
                      />
                    ) : null
                )}
              </tbody>
            </table>
          )}

        {bottom}
      </div>
    );
  }

  // TO-DO toogle track with token to sweep
  private toggleTrack = (symbol: string) => {
    this.setState({
      trackedTokens: {
        ...this.state.trackedTokens,
        [symbol]: !this.state.trackedTokens[symbol]
      }
    });

    this.setState({
      tokensToSweep: {
        ...this.state.tokensToSweep,
        [symbol]: !this.state.tokensToSweep[symbol]
      }
    });
  };

  private editTokens = () => {
    this.setState({
      showTokenChecklist: true
    });
  };

  private toggleShowCustomTokenForm = () => {
    this.setState({
      showCustomTokenForm: !this.state.showCustomTokenForm
    });
  };

  private addCustomToken = (token: Token) => {
    this.props.onAddCustomToken(token);
    this.setState({ showCustomTokenForm: false });
  };

  private handleSetWalletTokens = () => {
    const { trackedTokens } = this.state;
    const desiredTokens = Object.keys(trackedTokens).filter(t => trackedTokens[t]);
    this.setState({ showTokenChecklist: false });
    this.props.setWalletTokens(desiredTokens);
  };
}

export default SweeperList;
