import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { showNotification, TShowNotification } from 'actions/notifications';
import { Spinner, NewTabLink } from 'components/ui';
import Modal, { IButton } from 'components/ui/Modal';
import { addListener, sendEvent } from 'utils/electron';
import EVENTS from 'shared/electronEvents';
import { bytesToHuman } from 'utils/formatters';
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
  isDownloading: boolean;
  downloadProgress: DownloadProgress | null;
}

class UpdateModal extends React.Component<Props, State> {
  public state: State = {
    isDownloading: false,
    downloadProgress: null
  };

  public componentDidMount() {
    addListener(EVENTS.UPDATE.UPDATE_DOWNLOADED, () => {
      sendEvent(EVENTS.UPDATE.QUIT_AND_INSTALL);
    });
    addListener(EVENTS.UPDATE.DOWNLOAD_PROGRESS, downloadProgress => {
      this.setState({ downloadProgress });
    });
    addListener(EVENTS.UPDATE.ERROR, err => {
      console.error('Update failed:', err);
      this.setState({ isDownloading: false });
      this.props.showNotification(
        'danger',
        <span>
          Update could not be downloaded, please visit{' '}
          <NewTabLink href="https://github.com/MyEtherWallet/MyEtherWallet/releases">
            our github
          </NewTabLink>{' '}
          to download the latest release
        </span>,
        Infinity
      );
    });
  }

  public render() {
    const { isOpen, updateInfo, handleClose } = this.props;
    const { isDownloading, downloadProgress } = this.state;
    const buttons: IButton[] | undefined = downloadProgress
      ? undefined
      : [
          {
            text: <span>{isDownloading && <Spinner />} Download Update</span>,
            type: 'primary',
            onClick: this.downloadUpdate,
            disabled: isDownloading
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
              <div className="UpdateModal-downloader-info">
                <span className="UpdateModal-downloader-info-bit">
                  Downloaded {downloadProgress.percent.toFixed(1)}%
                </span>
                <span className="UpdateModal-downloader-info-bit">
                  {bytesToHuman(downloadProgress.bytesPerSecond)}/s
                </span>
                <span className="UpdateModal-downloader-info-bit">
                  Total Size {bytesToHuman(downloadProgress.total)}
                </span>
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
    this.setState({ isDownloading: true });
    sendEvent('UPDATE:download-update');
  };
}

export default connect(undefined, { showNotification })(UpdateModal);
