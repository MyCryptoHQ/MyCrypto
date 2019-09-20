import React, { Component } from 'react';
import unlock from 'assets/images/unlock.svg';
import './UnlockButton.scss';

interface UnlockButtonState {
  locked: string;
}

interface UnlockEvent extends Event {
  detail: string;
}

interface UnlockWindow extends Window {
  unlockProtocol?: any;
}

export default class UnlockButton extends Component {
  public state: UnlockButtonState = {
    locked: 'pending'
  };

  public constructor(props: {}) {
    super(props);
    this.unlockHandler = this.unlockHandler.bind(this);
    this.checkout = this.checkout.bind(this);
  }

  public componentDidMount() {
    window.addEventListener('unlockProtocol', this.unlockHandler);
    if ((window as UnlockWindow).unlockProtocol) {
      this.setState(() => {
        return {
          locked: (window as UnlockWindow).unlockProtocol.getState()
        };
      });
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('unlockProtocol', this.unlockHandler);
  }

  public render() {
    const { locked } = this.state;
    let callToAction = '...';
    if (locked === 'unlocked') {
      callToAction = 'Thanks for being a member!';
    } else if (locked === 'locked') {
      callToAction = 'Join us now!';
    }

    return (
      <button onClick={this.checkout} className="DonationButton Unlock">
        <img src={unlock} alt={`Icon for Unlock`} />
        {callToAction}
      </button>
    );
  }

  protected unlockHandler(event: UnlockEvent) {
    this.setState(() => {
      return {
        locked: event.detail
      };
    });
  }

  protected checkout() {
    (window as UnlockWindow).unlockProtocol.loadCheckoutModal();
  }
}
