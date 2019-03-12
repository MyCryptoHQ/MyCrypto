import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button, Typography } from '@mycrypto/ui';

import { ContentPanel } from 'v2/components';
import { Layout } from 'v2/features';
import './DownloadApp.scss';

// Legacy
import desktopAppIcon from 'common/assets/images/icn-desktop-app.svg';

export function DownloadApp({ history }: RouteComponentProps<{}>) {
  return (
    <Layout centered={true}>
      <ContentPanel onBack={history.goBack} className="DownloadApp" heading="Download App">
        <Typography>
          Please download the MyCrypto Desktop app so you can securely complete creating your new
          account and start managing your funds.
        </Typography>
        <img className="DownloadApp-icon" src={desktopAppIcon} alt="Desktop" />
        <Button className="DownloadApp-option">Download for Linux (64-bit)</Button>
        <div className="DownloadApp-optionGroup">
          <Button className="DownloadApp-optionGroup-option" secondary={true}>
            Linux (32-bit)
          </Button>
          <Button className="DownloadApp-optionGroup-option" secondary={true}>
            Mac
          </Button>
        </div>
        <div className="DownloadApp-optionGroup">
          <Button className="DownloadApp-optionGroup-option" secondary={true}>
            Windows
          </Button>
          <Button className="DownloadApp-optionGroup-option" secondary={true}>
            Stand Alone
          </Button>
        </div>
        <Typography>
          Not sure what this is? <a href="#">Learn more about our desktop app.</a>
        </Typography>
      </ContentPanel>
    </Layout>
  );
}

export default withRouter(DownloadApp);
