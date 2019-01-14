import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button, ComboBox } from '@mycrypto/ui';

import SteppedPanel from './SteppedPanel';
import './SelectNetworkPanel.scss';

export function SelectNetworkPanel({ history }: RouteComponentProps<{}>) {
  return (
    <SteppedPanel
      heading="Select Network"
      description="Not sure what to choose? Leave displayed defaults below and just click next!"
      currentStep={1}
      totalSteps={4}
      onBack={history.goBack}
      className="SelectNetworkPanel"
    >
      <label>Network</label>
      <ComboBox value="Ethereum" items={new Set(['Ethereum'])} />
      <label>Node</label>
      <ComboBox value="Automatic" items={new Set(['Automatic'])} />
      <Button className="SelectNetworkPanel-next">Next</Button>
    </SteppedPanel>
  );
}

export default withRouter(SelectNetworkPanel);
