import React from 'react';
import { Button, ComboBox } from '@mycrypto/ui';
import styled from 'styled-components';

import { ExtendedContentPanel } from 'v2/components';
import { PanelProps } from '../CreateWallet';
import translate, { translateRaw } from 'translations';

interface Props extends PanelProps {
  totalSteps: number;
}

const NetworkForm = styled.div`
  margin-top: 22px;
`;

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 30px;
  font-size: 18px;
`;

export default function SelectNetworkPanel({ totalSteps, onBack, onNext }: Props) {
  return (
    <ExtendedContentPanel
      onBack={onBack}
      stepper={{
        current: 2,
        total: totalSteps
      }}
      heading={translateRaw('SELECT_NETWORK_TITLE')}
      description={translate('SELECT_NETWORK_DESCRIPTION')}
      className="SelectNetworkPanel"
    >
      <NetworkForm>
        <label>{translateRaw('SELECT_NETWORK_LABEL')}</label>
        <ComboBox value="Ethereum" items={new Set(['Ethereum'])} />
      </NetworkForm>
      <SubmitButton className="SelectNetworkPanel-next" onClick={onNext}>
        {translateRaw('ACTION_6')}
      </SubmitButton>
    </ExtendedContentPanel>
  );
}
