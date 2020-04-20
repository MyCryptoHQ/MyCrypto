import React, { Component } from 'react';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import translate, { translateRaw } from 'v2/translations';
import { ExtendedContentPanel, InlineMessage, NetworkSelectDropdown } from 'v2/components';
import { WalletId, NetworkId } from 'v2/types';
import { NetworkContext } from 'v2/services/Store';
import { PanelProps } from '../CreateWallet';

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
  network: NetworkId;
  accountType: WalletId;
  selectNetwork(network: string): void;
}

export default class SelectNetworkPanel extends Component<Props> {
  public static contextType = NetworkContext;
  public state = { error: false };

  public handleSubmitClick = () => {
    const { network, onNext } = this.props;
    if (this.context.getNetworkById(network)) {
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
            <InlineMessage>{translateRaw('SELECT_NETWORK_ERROR')}</InlineMessage>
          </ErrorWrapper>
        )}
        <SubmitButton onClick={this.handleSubmitClick}>{translateRaw('ACTION_6')}</SubmitButton>
      </ExtendedContentPanel>
    );
  }
}
