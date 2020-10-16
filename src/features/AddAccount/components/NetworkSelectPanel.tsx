import React, { useState } from 'react';

import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { Body, Box, Heading, NetworkSelector } from '@components';
import { useNetworks } from '@services/Store';
import { SPACING } from '@theme';
import translate from '@translations';
import { FormData, NetworkId } from '@types';

import { FormDataActionType as ActionType } from '../types';

const NetworkForm = styled.div`
  margin-top: ${SPACING.BASE};
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
`;

const SButton = styled(Button)`
  max-width: 420px;
  width: 100%;
  height: 50px;
  position: absolute;
  bottom: 2em;
`;

interface Props {
  formData: FormData;
  formDispatch: any;
  goToNextStep(): void;
}

function NetworkSelectPanel({ formData, formDispatch, goToNextStep }: Props) {
  const { networks } = useNetworks();
  const [network, setNetwork] = useState<NetworkId>(formData.network);

  const onSubmit = () => {
    formDispatch({
      type: ActionType.SELECT_NETWORK,
      payload: { network }
    });
    goToNextStep();
  };

  const validNetwork = networks.some((n) => n.id === network);

  return (
    <Box p="2.5em" height="629px" position="relative">
      <Heading fontSize="32px" textAlign="center" fontWeight="bold">
        {translate('ADD_ACCOUNT_NETWORK_TITLE')}
      </Heading>
      <Body textAlign="center" fontSize="2" paddingTop="16px">
        {translate('ADD_ACCOUNT_NETWORK_SELECT')}
      </Body>
      <NetworkForm>
        <NetworkSelector
          network={network}
          accountType={formData.accountType!}
          onChange={setNetwork}
          showTooltip={true}
        />
      </NetworkForm>
      <ButtonWrapper>
        <SButton disabled={!validNetwork} onClick={onSubmit}>
          {translate('ADD_ACCOUNT_NETWORK_ACTION')}
        </SButton>
      </ButtonWrapper>
    </Box>
  );
}

export default NetworkSelectPanel;
