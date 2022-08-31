import { useState } from 'react';

import styled from 'styled-components';

import { Body, Box, Button, Heading, NetworkSelector } from '@components';
import { useNetworks } from '@services/Store';
import translate from '@translations';
import { FormData, NetworkId } from '@types';

import { FormDataActionType as ActionType } from '../types';

const NetworkForm = styled.div`
  margin-top: 2em;
`;

const SButton = styled(Button)`
  margin-top: 4em;
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
    <Box position="relative">
      <Heading fontSize="32px" textAlign="center" fontWeight="bold" mt="0">
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
      <SButton fullwidth={true} disabled={!validNetwork} onClick={onSubmit}>
        {translate('ADD_ACCOUNT_NETWORK_ACTION')}
      </SButton>
    </Box>
  );
}

export default NetworkSelectPanel;
