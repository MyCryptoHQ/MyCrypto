import React from 'react';
import { Button, Panel, Heading, Typography } from '@mycrypto/ui';

import './DownloadAppPanel.scss';

// Legacy
import desktopAppIcon from 'common/assets/images/icn-desktop-app.svg';

export default function DownloadAppPanel() {
  return (
    <Panel className="DownloadAppPanel">
      <Heading className="DownloadAppPanel-heading">Download App</Heading>
      <Typography>
        Please download the MyCrypto Desktop app so you can securely complete creating your new
        account and start managing your funds.
      </Typography>
      <img className="DownloadAppPanel-icon" src={desktopAppIcon} alt="Desktop" />
      <Button className="DownloadAppPanel-option">Download for Linux (64-bit)</Button>
      <div className="DownloadAppPanel-optionGroup">
        <Button className="DownloadAppPanel-optionGroup-option" secondary={true}>
          Linux (32-bit)
        </Button>
        <Button className="DownloadAppPanel-optionGroup-option" secondary={true}>
          Mac
        </Button>
      </div>
      <div className="DownloadAppPanel-optionGroup">
        <Button className="DownloadAppPanel-optionGroup-option" secondary={true}>
          Windows
        </Button>
        <Button className="DownloadAppPanel-optionGroup-option" secondary={true}>
          Stand Alone
        </Button>
      </div>
      <Typography>
        Not sure what this is? <a href="#">Learn more about our desktop app.</a>
      </Typography>
    </Panel>
  );
}
