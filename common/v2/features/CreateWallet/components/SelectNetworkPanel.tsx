import React from 'react';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { ExtendedContentPanel, NetworkSelectDropdown } from 'v2/components';
import { PanelProps } from '../CreateWallet';
import translate, { translateRaw } from 'translations';
import { WalletName } from 'v2/config/data';

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

interface Props extends PanelProps {
  network: string;
  accountType: WalletName;
  selectNetwork(network: string): void;
}

export default function SelectNetworkPanel({
  totalSteps,
  currentStep,
  network,
  accountType,
  onBack,
  onNext,
  selectNetwork
}: Props) {
  return (
    <ExtendedContentPanel
      onBack={onBack}
      stepper={{
        current: currentStep,
        total: totalSteps
      }}
      heading={translateRaw('SELECT_NETWORK_TITLE')}
      description={translate('SELECT_NETWORK_DESCRIPTION')}
    >
      <NetworkForm>
        <NetworkSelectDropdown
          network={network}
          accountType={accountType}
          onChange={selectNetwork}
        />
      </NetworkForm>
      <SubmitButton onClick={onNext}>{translateRaw('ACTION_6')}</SubmitButton>
    </ExtendedContentPanel>
  );
}
