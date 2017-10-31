import React, { Component } from 'react';
import Template from './Template';
import { UtcKeystore } from 'libs/keystore';

interface Props {
  keystoreFile: Promise<UtcKeystore> | null | undefined;
}

class DownloadKeystore extends Component<Props, {}> {
  private downloadKeystore = () => {
    // const { keystoreFile } = this.props
    // keystoreFile.then()
  };
  public render() {
    let content = (
      <div>
        <div
          onClick={this.downloadKeystore}
          className="btn btn-primary btn-block"
        >
          Download Now
        </div>
      </div>
    );
    return (
      <div>
        <Template title="Download Keystore File" content={content} />
      </div>
    );
  }
}

export default DownloadKeystore;
