import React from 'react';
import { VERSION } from 'config/data';
import UpdateModal, { UpdateInfo } from 'components/UpdateModal';
import { addListener } from 'utils/electron';
import EVENTS from 'shared/electronEvents';
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
    addListener(EVENTS.UPDATE.UPDATE_AVAILABLE, updateInfo => {
      this.setState({ updateInfo });
    });
  }

  public render() {
    const { updateInfo, isModalOpen } = this.state;
    return (
      <div className="Version">
        <span className={`Version-text ${updateInfo ? 'has-update' : ''}`} onClick={this.openModal}>
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
