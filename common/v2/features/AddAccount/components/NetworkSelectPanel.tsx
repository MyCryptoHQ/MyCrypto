import React, { useState, useContext, useCallback } from 'react';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import translate from 'v2/translations';
import { FormDataActionType as ActionType } from '../types';
import { FormData, NetworkId } from 'v2/types';
import { NetworkSelectDropdown } from 'v2/components';
import { NetworkContext } from 'v2/services/Store';
import NetworkNodeDropdown from '../../../components/NetworkNodeDropdown';
import { ProviderHandler } from '../../../services/EthService/network';

const NetworkForm = styled.div`
  margin-top: 22px;
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

const SLabel = styled.label`
  margin-top: 15px;
  margin-bottom: 10px;
`;

interface Props {
  formData: FormData;
  formDispatch: any;
  goToNextStep(): void;
}

const NetworkSelectPanel = ({ formData, formDispatch, goToNextStep }: Props) => {
  const { networks, getNetworkById } = useContext(NetworkContext);
  const [network, setNetwork] = useState<NetworkId>(formData.network);

  const onSubmit = useCallback(async () => {
    try {
      const nodeNetwork = getNetworkById(network);
      const { selectedNode, nodes } = nodeNetwork;
      const node = nodes.find(n => n.name === selectedNode)!;
      const provider = new ProviderHandler({ ...nodeNetwork, nodes: [node] }, false);
      await provider.getCurrentBlock();

      formDispatch({
        type: ActionType.SELECT_NETWORK,
        payload: { network }
      });
      goToNextStep();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const validNetwork = networks.some(n => n.id === network);

  return (
    <div className="Panel">
      <div className="Panel-title">{translate('ADD_ACCOUNT_NETWORK_TITLE')}</div>
      <div className="Panel-description">{translate('ADD_ACCOUNT_NETWORK_SELECT')}</div>
      <NetworkForm>
        <NetworkSelectDropdown
          network={network}
          accountType={formData.accountType!}
          onChange={setNetwork}
          showTooltip={true}
        />
        <SLabel>Node</SLabel>
        <NetworkNodeDropdown networkId={network} />
      </NetworkForm>
      <ButtonWrapper>
        <SButton disabled={!validNetwork} onClick={onSubmit}>
          {translate('ADD_ACCOUNT_NETWORK_ACTION')}
        </SButton>
      </ButtonWrapper>
    </div>
  );
};

export default NetworkSelectPanel;
