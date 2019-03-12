import React from 'react';
import { Panel, Typography, Button } from '@mycrypto/ui';

import './DownloadAppPanel.scss';

import champagneIcon from 'common/assets/images/icn-champagne-2.svg';

export default function DownloadAppPanel() {
  return (
    <Panel basic className="DownloadAppPanel">
      <div className="DownloadAppPanel-callToAction">
        <Typography className="DownloadAppPanel-callToAction-title">
          Everything is Even More Secure with our Desktop App
        </Typography>
        <Typography className="DownloadAppPanel-callToAction-description">
          Keep your keys out of the browser with the MyCrypto Desktop App. You get more access to
          your funds, and scammers get less access to you.
        </Typography>
        <Button className="DownloadAppPanel-callToAction-button">Download for macOS</Button>
      </div>
      <img className="DownloadAppPanel-image" src={champagneIcon} />
    </Panel>
  );
}
