import React from 'react';
import translate, { translateRaw } from 'translations';
import Modal, { IButton } from 'components/ui/Modal';
import { getLatestElectronRelease } from 'utils/versioning';
import { VERSION } from 'config/data';

interface State {
  isOpen: boolean;
  newRelease?: string;
}

export default class NewAppReleaseModal extends React.Component<{}, State> {
  public state: State = {
    isOpen: false
  };

  public async componentDidMount() {
    try {
      const newRelease = await getLatestElectronRelease();
      if (newRelease) {
        this.setState({ isOpen: true, newRelease });
      }
    } catch (err) {
      console.error('Failed to fetch latest release from GitHub:', err);
    }
  }

  public render() {
    const { isOpen } = this.state;
    const buttons: IButton[] = [
      {
        text: translate('APP_UPDATE_CONFIRM'),
        type: 'primary',
        onClick: this.openRelease
      },
      {
        text: translate('APP_UPDATE_CANCEL'),
        type: 'default',
        onClick: this.close
      }
    ];

    return (
      <Modal
        title={translateRaw('APP_UPDATE_TITLE')}
        isOpen={isOpen}
        buttons={buttons}
        handleClose={this.close}
        maxWidth={520}
      >
        <h5>
          {translateRaw('APP_UPDATE_BODY')} {this.versionCompareStr()}
        </h5>
      </Modal>
    );
  }

  private versionCompareStr() {
    return (
      <>
        <p>Current Version: {VERSION}</p>
        <p>New Version: {this.state.newRelease}</p>
      </>
    );
  }

  private close = () => {
    this.setState({ isOpen: false });
  };

  private openRelease() {
    window.open('https://github.com/MyCryptoHQ/MyCrypto/releases/latest');
  }
}
