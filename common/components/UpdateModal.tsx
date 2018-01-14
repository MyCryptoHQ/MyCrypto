import React from 'react';

export interface UpdateInfo {
  version: string;
  sha512: string;
  releaseDate: string;
  releaseName: string;
  releaseNotes: string;
}

interface Props {
  updateInfo: UpdateInfo;
}

interface State {
  isDownloading: boolean;
}

export default class UpdateModal extends React.Component<Props, State> {
  public state: State = {
    isDownloading: false
  };

  public render() {
    return <div>Modal!</div>;
  }
}
