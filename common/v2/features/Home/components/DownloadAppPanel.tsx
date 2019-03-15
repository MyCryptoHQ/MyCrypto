import React from 'react';
import { Panel, Typography, Button } from '@mycrypto/ui';

import './DownloadAppPanel.scss';
import translate from 'translations';

import champagneIcon from 'common/assets/images/icn-champagne-2.svg';

export default function DownloadAppPanel() {
  return (
    <Panel basic={true} className="DownloadAppPanel">
      <div className="DownloadAppPanel-callToAction">
        <Typography className="DownloadAppPanel-callToAction-title">
          {translate('HOME_DOWNLOAD_TITLE')}
        </Typography>
        <Typography className="DownloadAppPanel-callToAction-description">
          {translate('HOME_DOWNLOAD_DESCRIPTION')}
        </Typography>
        <Button className="DownloadAppPanel-callToAction-button">Download for macOS</Button>
      </div>
      <img className="DownloadAppPanel-image" src={champagneIcon} />
    </Panel>
  );
}
