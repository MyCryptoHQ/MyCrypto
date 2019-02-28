import React from 'react';
import { Button, Typography } from '@mycrypto/ui';

import { ContentPanel } from 'v2/components';
import { PanelProps } from '../../CreateWallet';
import './SaveKeystoreFilePanel.scss';

export default function SaveKeystoreFilePanel({ onBack, onNext }: PanelProps) {
  return (
    <ContentPanel
      onBack={onBack}
      stepper={{
        current: 3,
        total: 3
      }}
      heading="Save Your Keystore File"
      className="SaveKeystoreFilePanel"
    >
      <img src="https://placehold.it/150x150" className="SaveKeystoreFilePanel-image" />
      <Typography>
        <strong>Don't lose it.</strong> It can't be recovered if you lose it.
      </Typography>
      <Typography>
        <strong>Don't share it.</strong> Your funds will be stolen if you use this on a malicious
        site.
      </Typography>
      <Typography>
        <strong>Keep it offline.</strong> Your funds are safest offline (on a USB drive or something
        similar). We don't recommend keeping your file on any cloud services like Dropbox, Google
        Drive, etc.
      </Typography>
      <Typography>
        <strong>Make a backup.</strong> Secure it like it's the millions of dollars it may one day
        be worth.
      </Typography>
      <Button secondary={true} onClick={onNext} className="SaveKeystoreFilePanel-button">
        Download Keystore File
      </Button>
      <Button secondary={true} onClick={onNext} className="SaveKeystoreFilePanel-button">
        Print Paper Wallet
      </Button>
      <Button onClick={onNext} className="SaveKeystoreFilePanel-button">
        Next
      </Button>
    </ContentPanel>
  );
}
