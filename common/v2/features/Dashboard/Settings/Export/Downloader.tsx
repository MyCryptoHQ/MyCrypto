import React from 'react';
import styled from 'styled-components';

import { Button } from 'v2/components';
import { makeBlob } from 'utils/blob';
import translate from 'translations';

const FullWidthDownloadLink = styled.a`
  width: 100%;
`;

class Downloader extends React.Component<{ getStorage(): void }> {
  public state = { blob: '', name: '' };

  public render() {
    const { blob, name } = this.state;
    return (
      <FullWidthDownloadLink href={blob} download={name} onClick={this.handleDownload}>
        <Button fullWidth={true}>{translate('SETTINGS_EXPORT_DOWNLOAD')}</Button>
      </FullWidthDownloadLink>
    );
  }

  private handleDownload = () => {
    const cache = String(this.props.getStorage());
    const settingsBlob = makeBlob('text/json;charset=UTF-8', cache);
    this.setState({ blob: settingsBlob, name: 'MyCryptoSettings20.json' });
  };
}

export default Downloader;
