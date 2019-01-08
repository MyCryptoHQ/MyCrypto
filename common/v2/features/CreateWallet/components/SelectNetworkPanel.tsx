import React from 'react';
import { ComboBox, Heading, Panel, Typography } from '@mycrypto/ui';

import './SelectNetworkPanel.scss';

export default function SelectNetworkPanel() {
  return (
    <Panel className="SelectNetworkPanel">
      <Heading className="SelectNetworkPanel-heading">Select Network</Heading>
      <Typography>
        Not sure what to choose? Leave displayed defaults below and just click next!
      </Typography>
      <label>Network</label>
      <ComboBox value="Ethereum" items={new Set(['Ethereum'])} />
      <label>Node</label>
      <ComboBox value="Automatic" items={new Set(['Automatic'])} />
    </Panel>
  );
}
