import React, { Component } from 'react';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';
import { getNetworkByName } from 'v2/libs';

import { ExtendedContentPanel, NetworkSelectDropdown } from 'v2/components';
import { InlineErrorMsg } from 'v2/components/ErrorMessages/InlineErrors';
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

const ErrorWrapper = styled.div`
  margin-top: 24px;
`;

interface Props extends PanelProps {
  network: string;
  accountType: WalletName;
  selectNetwork(network: string): void;
}

export default class SelectNetworkPanel extends Component<Props> {
  public state = { error: false };

  public handleSubmitClick = () => {
    const { network, onNext } = this.props;
    if (getNetworkByName(network)) {
      onNext();
    } else {
      this.setState({ error: true });
    }
  };

  public render() {
    const { totalSteps, currentStep, network, accountType, onBack, selectNetwork } = this.props;

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

        {this.state.error && (
          <ErrorWrapper>
            <InlineErrorMsg>{translateRaw('SELECT_NETWORK_ERROR')}</InlineErrorMsg>
          </ErrorWrapper>
        )}
        <SubmitButton onClick={this.handleSubmitClick}>{translateRaw('ACTION_6')}</SubmitButton>
      </ExtendedContentPanel>
    );
  }
}
