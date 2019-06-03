import React from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { makeBlob } from 'utils/blob';
import translate from 'translations';

const FullWidthButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
`;

const FullWidthDownloadLink = styled.a`
  width: 100%;
`;

class Downloader extends React.Component<{ cache: string; readCache(): void }> {
  public state = { blob: '', name: '' };
  public componentDidMount() {
    this.props.readCache();
    const settingsBlob = makeBlob('text/json;charset=UTF-8', this.props.cache);
    this.setState({ blob: settingsBlob, name: 'MyCryptoSettings.json' });
  }

  public render() {
    const { blob, name } = this.state;
    return (
      <FullWidthDownloadLink href={blob} download={name}>
        <FullWidthButton>{translate('SETTINGS_EXPORT_DOWNLOAD')}</FullWidthButton>
      </FullWidthDownloadLink>
    );
  }
}

export default Downloader;
