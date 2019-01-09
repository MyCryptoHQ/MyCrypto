import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button, Typography } from '@mycrypto/ui';

import SteppedPanel from './SteppedPanel';
import './SelectMethodPanel.scss';

// Legacy
import newWalletIcon from 'common/assets/images/icn-new-wallet.svg';

export function SelectMethodPanel({ history }: RouteComponentProps<{}>) {
  return (
    <SteppedPanel
      heading="Create New Wallet"
      description="Creating a mnemonic phrase - a list of 12 words -  will enable you to keep your funds safe and unlock your wallet."
      currentStep={2}
      totalSteps={4}
      onBack={history.goBack}
      className="SelectMethodPanel"
    >
      <div className="SelectMethodPanel-content">
        <img src={newWalletIcon} alt="New wallet" className="SelectMethodPanel-content-icon" />
        <Button className="SelectMethodPanel-content-button">Create Mnemonic Phrase</Button>
        <Typography>
          Don’t want use a phrase? <a href="#">Create wallet with keystore file.</a>
        </Typography>
        <Typography>
          Already have a wallet? <a href="#">Unlock it now.</a>
        </Typography>
      </div>
    </SteppedPanel>
  );
}

export default withRouter(SelectMethodPanel);
