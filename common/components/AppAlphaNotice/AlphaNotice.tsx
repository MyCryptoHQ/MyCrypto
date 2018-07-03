import React from 'react';
import moment from 'moment';

import { discordURL, APP_ALPHA_EXPIRATION } from 'config';
import { NewTabLink } from 'components/ui';
import './AlphaNotice.scss';

interface State {
  isFading: boolean;
  isClosed: boolean;
}

let hasAcknowledged = false;

export default class AppAlphaNotice extends React.PureComponent<{}, State> {
  public state = {
    isFading: false,
    isClosed: hasAcknowledged
  };

  public render() {
    if (this.state.isClosed) {
      return null;
    }

    const isFading = this.state.isFading ? 'is-fading' : '';
    const expDate = moment(APP_ALPHA_EXPIRATION).format('MMMM Do, YYYY');

    return (
      <div className={`AppAlpha ${isFading}`}>
        <div className="AppAlpha-content">
          <h2>Welcome to the MyCrypto Desktop App Alpha</h2>
          <p>
            Thank you for testing out the new MyCrypto desktop app. This is an early release to be
            tested by the community before a full launch. We recommend continuing to use the
            production site for large or otherwise important transactions.
          </p>
          <p>
            Because this is for testing purposes only,{' '}
            <strong>this build of the app will only be accessible until {expDate}</strong>. You’ll
            then be required to update the application to continue using it.
          </p>
          <p>
            Feedback and bug reports are greatly appreciated. You can file issues on our{' '}
            <NewTabLink href="https://github.com/MyCryptoHQ/MyCrypto/issues">
              GitHub repository
            </NewTabLink>{' '}
            or join our <NewTabLink href={discordURL}>Discord server</NewTabLink> to discuss the
            app.
          </p>
          <p>
            <b>
              For critical reports & vulnerabilities, please use{' '}
              <NewTabLink href="https://hackerone.com/MyCrypto">HackerOne</NewTabLink>.
            </b>
          </p>

          <button className="AppAlpha-content-btn is-continue" onClick={this.doContinue}>
            Continue to the Alpha
          </button>
        </div>
      </div>
    );
  }

  private doContinue = () => {
    hasAcknowledged = true;
    this.setState({ isFading: true });
    setTimeout(() => {
      this.setState({ isClosed: true });
    }, 1000);
  };
}
