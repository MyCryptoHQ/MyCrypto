import React from 'react';
import { TokenBalance } from 'selectors/wallet';
import { Token } from 'config/data';
import translate from 'translations';
import Balances from './Balances';
import Spinner from 'components/ui/Spinner';
import './index.scss';

interface Props {
  tokens: Token[];
  walletTokens: string[] | null;
  tokenBalances: TokenBalance[];
  isTokensLoading: boolean;
  hasSavedWalletTokens: boolean;
  tokensError: string | null;
  scanWalletForTokens(): any;
  setWalletTokens(tokens: string[]): any;
  onAddCustomToken(token: Token): any;
  onRemoveCustomToken(symbol: string): any;
}

export default class TokenBalances extends React.Component<Props, {}> {
  public render() {
    const {
      tokens,
      walletTokens,
      tokenBalances,
      hasSavedWalletTokens,
      isTokensLoading,
      tokensError,
      scanWalletForTokens,
      setWalletTokens,
      onAddCustomToken,
      onRemoveCustomToken
    } = this.props;

    let content;
    if (tokensError) {
      content = <h5>{tokensError}</h5>;
    } else if (isTokensLoading) {
      content = (
        <div className="TokenBalances-loader">
          <Spinner size="x3" />
        </div>
      );
    } else if (!walletTokens) {
      content = (
        <button className="btn btn-primary btn-block" onClick={scanWalletForTokens}>
          {translate('Scan for my Tokens')}
        </button>
      );
    } else {
      const shownBalances = tokenBalances.filter(t => walletTokens.includes(t.symbol));

      content = (
        <Balances
          allTokens={tokens}
          tokenBalances={shownBalances}
          hasSavedWalletTokens={hasSavedWalletTokens}
          scanWalletForTokens={scanWalletForTokens}
          setWalletTokens={setWalletTokens}
          onAddCustomToken={onAddCustomToken}
          onRemoveCustomToken={onRemoveCustomToken}
        />
      );
    }

    return (
      <section className="TokenBalances">
        <h5 className="TokenBalances-title">{translate('sidebar_TokenBal')}</h5>
        {content}
      </section>
    );
  }
}
