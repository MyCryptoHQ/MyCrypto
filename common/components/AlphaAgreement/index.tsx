import React from 'react';
import './index.scss';

const LS_KEY = 'acknowledged-alpha';

interface State {
  isFading: boolean;
  hasAcknowledged: boolean;
}
export default class AlphaAgreement extends React.Component<{}, State> {
  public state = {
    hasAcknowledged: !!localStorage.getItem(LS_KEY),
    isFading: false
  };

  public render() {
    if (this.state.hasAcknowledged) {
      return null;
    }

    const isFading = this.state.isFading ? 'is-fading' : '';

    return (
      <div className={`AlphaAgreement ${isFading}`}>
        <div className="AlphaAgreement-content">
          <h2>This is an Unstable Version of MEW</h2>
          <p>
            You are about to access an alpha version of MyEtherWallet that is currently in
            development. In its current state, it should only be used for testing, not for important
            transactions.
          </p>
          <p>
            Any wallets you generate should not hold a significant value, and any transactions you
            make should be for small amounts. MEW does not claim responsibility for any issues that
            happen while using the alpha version.
          </p>
          <p>Are you sure you would like to continue?</p>

          <div className="AlphaAgreement-content-buttons">
            <button className="AlphaAgreement-content-buttons-btn is-reject" onClick={this.reject}>
              No, Take Me to v3
            </button>
            <button
              className="AlphaAgreement-content-buttons-btn is-continue"
              onClick={this.doContinue}
            >
              Yes, Continue to v4
            </button>
          </div>
        </div>
      </div>
    );
  }

  private doContinue = () => {
    localStorage.setItem(LS_KEY, 'true');
    this.setState({ isFading: true });

    setTimeout(() => {
      this.setState({ hasAcknowledged: true });
    }, 1000);
  };

  private reject = () => {
    window.location.assign('https://myetherwallet.com');
  };
}
