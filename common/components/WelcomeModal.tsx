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

export default class WelcomeModal extends React.PureComponent<{}, State> {
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
              💖 {translate('WELCOME_MODAL_BETA')} 🚀
            </p>
          )}
          <p>{translate('WELCOME_MODAL_INTRO')}</p>
          <ul>
            <li>{translate('WELCOME_MODAL_FEATURE_1')}</li>
            <li>{translate('WELCOME_MODAL_FEATURE_2')}</li>
            <li>{translate('WELCOME_MODAL_FEATURE_3')}</li>
            <li>{translate('WELCOME_MODAL_FEATURE_4')}</li>
            <li>
              <NewTabLink href="https://download.mycrypto.com/">
                {translate('WELCOME_MODAL_FEATURE_5')}
              </NewTabLink>
            </li>
            <li>{translate('WELCOME_MODAL_FEATURE_MORE')}</li>
          </ul>
          <p>{translate('WELCOME_MODAL_LINKS')}</p>

          <button className="WelcomeModal-continue btn btn-lg btn-primary" onClick={this.close}>
            {translate('WELCOME_MODAL_CONTINUE')}
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
