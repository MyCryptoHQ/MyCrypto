import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { ComboBox, Heading, Typography } from '@mycrypto/ui';

import { ContentPanel, Stepper } from 'v2/components';
import './SelectNetworkPanel.scss';

export function SelectNetworkPanel({ history }: RouteComponentProps<{}>) {
  return (
    <ContentPanel onBack={history.goBack} className="SelectNetworkPanel">
      <div className="SelectNetworkPanel-top">
        <Stepper current={1} total={4} className="SelectNetworkPanel-top-stepper" />
        <Heading className="SelectNetworkPanel-top-heading">Select Network</Heading>
      </div>
      <Typography>
        Not sure what to choose? Leave displayed defaults below and just click next!
      </Typography>
      <label>Network</label>
      <ComboBox value="Ethereum" items={new Set(['Ethereum'])} />
      <label>Node</label>
      <ComboBox value="Automatic" items={new Set(['Automatic'])} />
    </ContentPanel>
  );
}

export default withRouter(SelectNetworkPanel);
