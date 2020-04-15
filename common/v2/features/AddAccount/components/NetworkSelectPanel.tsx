import React, { useState, useContext, useCallback } from 'react';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import translate from 'v2/translations';
import { FormDataActionType as ActionType } from '../types';
import { FormData, NetworkId } from 'v2/types';
import { NetworkSelectDropdown } from 'v2/components';
import { NetworkContext, NetworkUtils } from 'v2/services/Store';
import NetworkNodeDropdown from 'v2/components/NetworkNodeDropdown';
import { ProviderHandler } from 'v2/services/EthService/network';
import { SPACING } from 'v2/theme';
import { ToastContext } from '../../Toasts';

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

const SLabel = styled.label`
  margin-top: ${SPACING.BASE};
  margin-bottom: ${SPACING.SM};
`;

interface Props {
  formData: FormData;
  formDispatch: any;
  goToNextStep(): void;
}

function NetworkSelectPanel({ formData, formDispatch, goToNextStep }: Props) {
  const { networks, getNetworkById, setNetworkSelectedNode } = useContext(NetworkContext);
  const { displayToast, toastTemplates } = useContext(ToastContext);
  const [network, setNetwork] = useState<NetworkId>(formData.network);

  const onSubmit = useCallback(async () => {
    const networkNode = getNetworkById(network);

    try {
      const selectedNode = NetworkUtils.getSelectedNode(networkNode);
      const provider = new ProviderHandler({ ...networkNode, nodes: [selectedNode] }, false);
      await provider.getCurrentBlock();

      formDispatch({
        type: ActionType.SELECT_NETWORK,
        payload: { network }
      });
      goToNextStep();
    } catch (e) {
      console.debug(e);
      displayToast(toastTemplates.nodeConnectionError);
      setNetworkSelectedNode(networkNode.id, networkNode.autoNode!);
    }
  }, [network, networks, getNetworkById]);

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
}

export default NetworkSelectPanel;
