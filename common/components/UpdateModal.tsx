import React from 'react';
import { connect } from 'react-redux';
import { showNotification, TShowNotification } from 'actions/notifications';
import Modal, { IButton } from 'components/ui/Modal';
import moment from 'moment';
import { electronListen, electronSend } from 'utils/electron';
import './UpdateModal.scss';

export interface UpdateInfo {
  version: string;
  sha512: string;
  releaseDate: string;
  releaseName: string;
  releaseNotes: string;
}

export interface DownloadProgress {
  bytesPerSecond: number;
  percent: number;
  transferred: number;
  total: number;
}

interface Props {
  isOpen: boolean;
  updateInfo: UpdateInfo;
  showNotification: TShowNotification;
  handleClose(): void;
}

interface State {
  downloadProgress: DownloadProgress | null;
}

class UpdateModal extends React.Component<Props, State> {
  public state: State = {
    downloadProgress: null
  };

  public componentDidMount() {
    electronListen('UPDATE:download-progress', downloadProgress => {
      this.setState({ downloadProgress });
    });
    electronListen('UPDATE:update-downloaded', () => {
      electronSend('UPDATE:quit-and-install');
    });
    electronListen('UPDATE:error', err => {
      console.error('Update failed:', err);
      this.props.showNotification(
        'danger',
        <span>
          Update could not be downloaded, please visit
          <a href="https://github.com/MyEtherWallet/MyEtherWallet/releases">our github</a>
          to download the latest release
        </span>,
        Infinity
      );
    });
  }

  public render() {
    const { isOpen, updateInfo, handleClose } = this.props;
    const { downloadProgress } = this.state;
    const buttons: IButton[] | undefined = downloadProgress
      ? undefined
      : [
          {
            text: 'Download Update',
            type: 'primary',
            onClick: this.downloadUpdate
          },
          {
            text: 'Close',
            type: 'default',
            onClick: handleClose
          }
        ];

    return (
      <Modal
        isOpen={isOpen}
        title={`Update Information`}
        handleClose={handleClose}
        buttons={buttons}
      >
        <div className="UpdateModal">
          {downloadProgress ? (
            <div className="UpdateModal-downloader">
              <h3 className="UpdateModal-downloader-title">Downloading...</h3>
              <div className="UpdateModal-downloader-bar">
                <div
                  className="UpdateModal-downloader-bar-inner"
                  style={{
                    width: `${downloadProgress.percent}%`
                  }}
                />
              </div>
            </div>
          ) : (
            <div>
              <h1 className="UpdateModal-title">{updateInfo.releaseName}</h1>
              <div className="UpdateModal-date">{moment(updateInfo.releaseDate).format('LL')}</div>
              <div
                className="UpdateModal-content"
                dangerouslySetInnerHTML={{
                  __html: updateInfo.releaseNotes
                }}
              />
            </div>
          )}
        </div>
      </Modal>
    );
  }

  private downloadUpdate = () => {
    electronSend('UPDATE:download-update');
  };
}

export default connect(undefined, { showNotification })(UpdateModal);
