import React from 'react';
import translate, { translateRaw } from 'translations';
import Modal, { IButton } from 'components/ui/Modal';
import { VERSION_RC } from 'config';
import { isNewerVersion } from 'utils/helpers';

interface IGitHubRelease {
  tag_name: string;
}

function getLatestGitHubRelease(): Promise<IGitHubRelease> {
  return fetch('https://api.github.com/repos/MyCryptoHQ/MyCrypto/releases/latest', {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json; charset=utf-8'
    }
  })
    .then(res => res.json())
    .then(data => data as IGitHubRelease);
}

interface State {
  isOpen: boolean;
}

export default class NewAppReleaseModal extends React.Component<{}, State> {
  public state: State = {
    isOpen: false
  };

  public async componentDidMount() {
    try {
      const release = await getLatestGitHubRelease();
      // TODO: Use VERSION once done with release candidates
      if (isNewerVersion(VERSION_RC, release.tag_name)) {
        this.setState({ isOpen: true });
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
        <h5>{translateRaw('APP_UPDATE_BODY')}</h5>
      </Modal>
    );
  }

  private close = () => {
    this.setState({ isOpen: false });
  };

  private openRelease() {
    window.open('https://github.com/MyCryptoHQ/MyCrypto/releases/latest');
  }
}
