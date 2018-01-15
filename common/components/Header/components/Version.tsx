import React from 'react';
import { VERSION } from 'config/data';
import UpdateModal, { UpdateInfo } from 'components/UpdateModal';
import { electronListen } from 'utils/electron';
import './Version.scss';

interface State {
  updateInfo: UpdateInfo | null;
  isModalOpen: boolean;
}

export default class Version extends React.Component<{}, State> {
  public state: State = {
    updateInfo: null,
    isModalOpen: false
  };

  public componentDidMount() {
    electronListen('UPDATE:checking-for-update', () => {
      console.log('Checking for update!');
    });

    electronListen('UPDATE:update-available', updateInfo => {
      console.log('Update info', updateInfo);
      this.setState({ updateInfo });
    });

    electronListen('UPDATE:error', err => {
      console.error('Update failed', err);
    });
  }

  public render() {
    const { updateInfo, isModalOpen } = this.state;
    return (
      <div className="Version">
        <span className="Version-text" onClick={this.openModal}>
          v{VERSION}
        </span>
        {updateInfo && (
          <span>
            <span className="Version-new" />
            <UpdateModal
              isOpen={isModalOpen}
              updateInfo={updateInfo}
              handleClose={this.closeModal}
            />
          </span>
        )}
      </div>
    );
  }

  private openModal = () => this.setState({ isModalOpen: true });
  private closeModal = () => this.setState({ isModalOpen: false });
}
