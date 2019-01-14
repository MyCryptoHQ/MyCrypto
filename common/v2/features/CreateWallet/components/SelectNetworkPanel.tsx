import React from 'react';
import { Button, ComboBox } from '@mycrypto/ui';

import { PanelProps } from '../CreateWallet';
import SteppedPanel from './SteppedPanel';
import './SelectNetworkPanel.scss';

export default function SelectNetworkPanel({ onBack, onNext }: PanelProps) {
  return (
    <SteppedPanel
      heading="Select Network"
      description="Not sure what to choose? Leave displayed defaults below and just click next!"
      currentStep={1}
      totalSteps={4}
      onBack={onBack}
      className="SelectNetworkPanel"
    >
      <label>Network</label>
      <ComboBox value="Ethereum" items={new Set(['Ethereum'])} />
      <label>Node</label>
      <ComboBox value="Automatic" items={new Set(['Automatic'])} />
      <Button className="SelectNetworkPanel-next" onClick={onNext}>
        Next
      </Button>
    </SteppedPanel>
  );
}
