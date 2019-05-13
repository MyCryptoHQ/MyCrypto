import React from 'react';
import { Button, ComboBox } from '@mycrypto/ui';

import { ContentPanel } from 'v2/components';
import { PanelProps } from '../CreateWallet';
import './SelectNetworkPanel.scss';

interface Props extends PanelProps {
  totalSteps: number;
}

export default function SelectNetworkPanel({ totalSteps, onBack, onNext }: Props) {
  return (
    <ContentPanel
      onBack={onBack}
      stepper={{
        current: 2,
        total: totalSteps
      }}
      heading="Select Network"
      description="Not sure what to choose? Leave displayed defaults below and just click next!"
      className="SelectNetworkPanel"
    >
      <label>Network</label>
      <ComboBox value="Ethereum" items={new Set(['Ethereum'])} />
      <label>Node</label>
      <ComboBox value="Automatic" items={new Set(['Automatic'])} />
      <Button className="SelectNetworkPanel-next" onClick={onNext}>
        Next
      </Button>
    </ContentPanel>
  );
}
