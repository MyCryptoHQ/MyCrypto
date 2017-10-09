import React from 'react';
import { withRouter } from 'react-router-dom';
import Modal, { IButton } from 'components/ui/Modal';

interface InjectedProps {
  history: History;
  location: {};
  match: {};
}

interface Props extends InjectedProps {
  when: boolean;
  onConfirm?: void;
  onCancel?: void;
}

interface State {
  nextLocation;
  openModal: boolean;
}

class NavigationPrompt extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      nextLocation: null,
      openModal: false
    };
  }

  public componentDidMount() {
    this.unblock = this.props.history.block(nextLocation => {
      if (
        this.props.when &&
        nextLocation.pathname !== this.props.location.pathname
      ) {
        this.setState({
          openModal: true,
          nextLocation: nextLocation
        });
      }
      return !this.props.when;
    });
  }

  public componentWillUnmount() {
    this.unblock();
  }

  public onCancel = () => {
    this.props.onCancel ? this.props.onCancel() : null;
    this.setState({ nextLocation: null, openModal: false });
  };

  public onConfirm = () => {
    this.props.onConfirm ? this.props.onConfirm() : null;
    // Lock Wallet
    this.navigateToNextLocation();
  };

  public navigateToNextLocation() {
    this.unblock();
    this.state.nextLocation
      ? this.props.history.push(this.state.nextLocation.pathname)
      : null;
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
        <p>
          Leaving this page will log you out. Are you sure you want to continue?
        </p>
      </Modal>
    );
  }
}

export default withRouter(NavigationPrompt);
