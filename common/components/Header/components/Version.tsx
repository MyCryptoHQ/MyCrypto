import React from 'react';
// import { ipcRenderer } from 'electron';
import { VERSION } from 'config/data';
import UpdateModal, { UpdateInfo } from 'components/UpdateModal';

interface State {
  updateInfo: UpdateInfo | null;
}

export default class Version extends React.Component<{}, State> {
  public state: State = {
    updateInfo: null
  };

  public componentDidMount() {
    if (!process.env.BUILD_ELECTRON) {
      return;
    }

    // ipcRenderer.on('UPDATE:update-available', (updateInfo) => {
    //   this.setState({ updateInfo });
    // });
  }

  public render() {
    const { updateInfo } = this.state;
    return (
      <div className="Version">
        v{VERSION}
        {updateInfo && '(UPDATE)'}
      </div>
    );
  }
}
