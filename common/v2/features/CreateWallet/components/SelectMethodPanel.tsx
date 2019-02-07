import React from 'react';
import { Button, Typography } from '@mycrypto/ui';

import { ContentPanel } from 'v2/components';
import { PanelProps } from '../CreateWallet';
import './SelectMethodPanel.scss';

// Legacy
import newWalletIcon from 'common/assets/images/icn-new-wallet.svg';

export default function SelectMethodPanel({ onBack, onNext }: PanelProps) {
  return (
    <ContentPanel
      onBack={onBack}
      stepper={{
        current: 2,
        total: 5
      }}
      heading="Create New Wallet"
      description="Creating a mnemonic phrase - a list of 12 words -  will enable you to keep your funds safe and unlock your wallet."
      className="SelectMethodPanel"
    >
      <div className="SelectMethodPanel-content">
        <img src={newWalletIcon} alt="New wallet" className="SelectMethodPanel-content-icon" />
        <Button className="SelectMethodPanel-content-button" onClick={onNext}>
          Create Mnemonic Phrase
        </Button>
        <Typography>
          Don’t want use a phrase? <a href="#">Create wallet with keystore file.</a>
        </Typography>
        <Typography>
          Already have a wallet? <a href="#">Unlock it now.</a>
        </Typography>
      </div>
    </ContentPanel>
  );
}
