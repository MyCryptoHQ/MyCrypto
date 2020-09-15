import React, { Component } from 'react';

import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { ExtendedContentPanel, InlineMessage, NetworkSelectDropdown } from '@components';
import { INetworkContext, useNetworks } from '@services';
import translate, { translateRaw } from '@translations';
import { NetworkId, WalletId } from '@types';
import { withHook } from '@utils';

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

class SelectNetworkPanel extends Component<Props & INetworkContext> {
  public state = { error: false };

  public handleSubmitClick = () => {
    const { network, onNext } = this.props;
    if (this.props.getNetworkById(network)) {
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

export default withHook(useNetworks)(SelectNetworkPanel);
