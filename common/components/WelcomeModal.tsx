import React from 'react';
import translate from 'translations';
import { Modal, NewTabLink } from 'components/ui';
import { isLegacyUser, isBetaUser } from 'utils/localStorage';
import Logo from 'assets/images/logo-mycrypto-transparent.svg';
import './WelcomeModal.scss';

const LS_KEY = 'acknowledged-welcome';

interface State {
  isOpen: boolean;
}

export default class WelcomeModal extends React.Component<{}, State> {
  public state: State = {
    isOpen: false
  };

  public componentDidMount() {
    if (isLegacyUser() && !localStorage.getItem(LS_KEY)) {
      this.setState({ isOpen: true });
    }
  }

  public render() {
    return (
      <Modal isOpen={this.state.isOpen} handleClose={this.close} maxWidth={660}>
        <div className="WelcomeModal">
          <img className="WelcomeModal-logo" src={Logo} />
          {isBetaUser() && (
            <p className="WelcomeModal-beta alert alert-success">
              💖 Thank you for testing the beta! People like you made this launch possible 🚀
            </p>
          )}
          <p>
            Welcome to the all new MyCrypto! We've made some cool new changes to the site that we're
            excited to show you. Beyond the new and improved look and feel of the site, we've also
            added a ton of new features:
          </p>
          <ul>
            <li>Token balance scanner</li>
            <li>Combined Send, Info, and Send Offline tabs</li>
            <li>Parity Signer app integration</li>
            <li>Recent transactions history</li>
            <li>
              <NewTabLink href="https://download.mycrypto.com/">
                A downloadable desktop app
              </NewTabLink>
            </li>
            <li>...and much, much more!</li>
          </ul>
          <p>
            You can read more about the new release on{' '}
            <NewTabLink href="https://google.com">our blog post</NewTabLink>. Help out with any
            issues you find by{' '}
            <NewTabLink href="https://github.com/MyCryptoHQ/MyCrypto/issues">
              reporting bugs on GitHub
            </NewTabLink>. Need something from the old site, or just miss that clunky feel? We've
            kept it up at{' '}
            <NewTabLink href="https://classic.mycrypto.com">classic.mycrypto.com</NewTabLink>.
          </p>

          <button className="WelcomeModal-continue btn btn-lg btn-primary" onClick={this.close}>
            Show me the new site!
          </button>
        </div>
      </Modal>
    );
  }

  private close = () => {
    this.setState({ isOpen: false });
    localStorage.setItem(LS_KEY, 'true');
  };
}
