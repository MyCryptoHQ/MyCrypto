import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import translate from 'translations';
import { IWallet } from 'libs/wallet/IWallet';
import { AppState } from 'features/reducers';
import WalletDecrypt, { DisabledWallets } from 'components/WalletDecrypt';
import './UnlockHeader.scss';

interface OwnProps {
  title?: string;
  wallet: IWallet;
  disabledWallets?: DisabledWallets;
  showGenerateLink?: boolean;
}

interface State {
  isExpanded: boolean;
}

type Props = OwnProps & RouteComponentProps<{}>;
export class UnlockHeader extends React.PureComponent<Props, State> {
  public state = {
    isExpanded: !this.props.wallet
  };

  public componentDidUpdate(prevProps: Props) {
    if (this.props.wallet !== prevProps.wallet) {
      this.setState({ isExpanded: !this.props.wallet });
    }
  }

  public render() {
    const { title, wallet, disabledWallets, showGenerateLink, history } = this.props;
    const { isExpanded } = this.state;

    return (
      <article className="UnlockHeader">
        {title && <h1 className="UnlockHeader-title">{title}</h1>}
        {wallet &&
          !isExpanded && (
            <button
              className="UnlockHeader-open btn btn-default btn-smr"
              onClick={() => history.push('/')}
            >
              <span>
                <span className="hidden-xs UnlockHeader-open-text">
                  {translate('CHANGE_WALLET')}
                </span>
                <i className="fa fa-refresh" />
              </span>
            </button>
          )}
        <WalletDecrypt
          hidden={!this.state.isExpanded}
          disabledWallets={disabledWallets}
          showGenerateLink={showGenerateLink}
        />
      </article>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    wallet: state.wallet.inst
  };
}

export default withRouter(connect(mapStateToProps)(UnlockHeader));
