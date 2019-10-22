import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import translate, { translateRaw } from 'translations';
import { AppState } from 'features/reducers';
import { configNodesStaticActions } from 'features/config';
import { walletActions } from 'features/wallet';
import Modal, { IButton } from 'components/ui/Modal';

interface DispatchProps {
  web3UnsetNode: configNodesStaticActions.TWeb3UnsetNode;
  resetWallet: walletActions.TResetWallet;
}

interface StateProps {
  wallet: AppState['wallet']['inst'];
}

type Props = DispatchProps & StateProps & RouteComponentProps<{}>;

interface State {
  nextLocation: RouteComponentProps<{}>['location'] | null;
  openModal: boolean;
}

class LogOutPromptClass extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      nextLocation: null,
      openModal: false
    };

    this.props.history.block(nextLocation => {
      if (this.props.wallet && nextLocation.pathname !== this.props.location.pathname) {
        const isSubTab =
          nextLocation.pathname.split('/')[1] === this.props.location.pathname.split('/')[1];
        if (!isSubTab) {
          this.setState({
            openModal: true,
            nextLocation
          });
          return false;
        }
      }
    });
  }

  public render() {
    const buttons: IButton[] = [
      { text: translate('ACTION_7'), type: 'primary', onClick: this.onConfirm },
      { text: translate('ACTION_2'), type: 'default', onClick: this.onCancel }
    ];
    return (
      <Modal
        title={translateRaw('WALLET_LOGOUT_MODAL_TITLE')}
        isOpen={this.state.openModal}
        handleClose={this.onCancel}
        buttons={buttons}
      >
        <p>{translate('WALLET_LOGOUT_MODAL_DESC')}</p>
      </Modal>
    );
  }

  private onCancel = () => {
    this.setState({ nextLocation: null, openModal: false });
  };

  private onConfirm = () => {
    const { nextLocation: next } = this.state;
    this.props.resetWallet();
    this.setState(
      {
        openModal: false,
        nextLocation: null
      },
      () => {
        if (next) {
          this.props.history.push(`${next.pathname}${next.search}${next.hash}`);
          this.props.web3UnsetNode();
        }
      }
    );
  };
}

function mapStateToProps(state: AppState) {
  return { wallet: state.wallet.inst };
}

export default connect(
  mapStateToProps,
  {
    resetWallet: walletActions.resetWallet,
    web3UnsetNode: configNodesStaticActions.web3UnsetNode
  }
)(withRouter(LogOutPromptClass));
