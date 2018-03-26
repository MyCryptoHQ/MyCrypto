import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Modal, { IButton } from 'components/ui/Modal';
import { AppState } from 'reducers';
import { resetWallet, TResetWallet } from 'actions/wallet';
import translate, { translateRaw } from 'translations';

interface Props extends RouteComponentProps<{}> {
  // State
  wallet: AppState['wallet']['inst'];
  // Actions
  resetWallet: TResetWallet;
}

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
        }
      }
    );
  };
}

function mapStateToProps(state: AppState) {
  return { wallet: state.wallet.inst };
}

export default connect(mapStateToProps, {
  resetWallet
})(withRouter<Props>(LogOutPromptClass));
