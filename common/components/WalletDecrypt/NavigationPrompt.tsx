import React from 'react';
import { withRouter } from 'react-router-dom';
import Modal, { IButton } from 'components/ui/Modal';
import { Location, History } from 'history';

interface Props {
  when: boolean;
  onConfirm?: any;
  onCancel?: any;
}

interface InjectedProps extends Props {
  location: Location;
  history: History;
}

interface State {
  nextLocation: Location | null;
  openModal: boolean;
}

class NavigationPrompt extends React.Component<Props, State> {
  public unblock;
  get injected() {
    return this.props as InjectedProps;
  }

  constructor(props) {
    super(props);
    this.state = {
      nextLocation: null,
      openModal: false
    };
  }

  public setupUnblock() {
    this.unblock = this.injected.history.block(nextLocation => {
      if (this.props.when && nextLocation.pathname !== this.injected.location.pathname) {
        const isSubTab =
          nextLocation.pathname.split('/')[1] === this.injected.location.pathname.split('/')[1];
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

  public componentDidMount() {
    this.setupUnblock();
  }

  public componentWillUnmount() {
    this.unblock();
  }

  public onCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
    this.setState({ nextLocation: null, openModal: false });
  };

  public onConfirm = () => {
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
    // Lock Wallet
    this.navigateToNextLocation();
  };

  public navigateToNextLocation() {
    this.unblock();
    if (this.state.nextLocation) {
      this.injected.history.push(this.state.nextLocation.pathname);
    }
  }

  public render() {
    const buttons: IButton[] = [
      { text: 'Log Out', type: 'primary', onClick: this.onConfirm },
      { text: 'Cancel', type: 'default', onClick: this.onCancel }
    ];
    return (
      <Modal
        title="You are about to log out"
        isOpen={this.state.openModal}
        handleClose={this.onCancel}
        buttons={buttons}
      >
        <p>Leaving this page will log you out. Are you sure you want to continue?</p>
      </Modal>
    );
  }
}

export default withRouter(NavigationPrompt);
