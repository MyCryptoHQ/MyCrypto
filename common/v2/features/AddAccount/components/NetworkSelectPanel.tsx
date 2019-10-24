import React, { useState, useContext } from 'react';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import './NetworkSelectPanel.scss';

import { translate } from 'v2/translations';
import { FormDataActionType as ActionType } from '../types';
import { FormData } from 'v2/types';
import { NetworkSelectDropdown } from 'v2/components';
import { NetworkContext } from 'v2/services/Store';

const NetworkForm = styled.div`
  margin-top: 22px;
`;

interface Props {
  formData: FormData;
  formDispatch: any;
  goToNextStep(): void;
}

function NetworkSelectPanel({ formData, formDispatch, goToNextStep }: Props) {
  const { networks } = useContext(NetworkContext);
  const [network, setNetwork] = useState(formData.network);

  const onSubmit = () => {
    formDispatch({
      type: ActionType.SELECT_NETWORK,
      payload: { network }
    });
    goToNextStep();
  };

  const validNetwork = networks.some(n => n.id === network);

  return (
    <div className="Panel">
      <div className="Panel-title">{translate('ADD_ACCOUNT_NETWORK_TITLE')}</div>
      <div className="Panel-description" id="NetworkPanel-description">
        {translate('ADD_ACCOUNT_NETWORK_SELCT')}
      </div>
      <NetworkForm>
        <NetworkSelectDropdown
          network={network}
          accountType={formData.accountType!}
          onChange={setNetwork}
        />
      </NetworkForm>
      <div className="SelectNetworkPanel-button-container">
        <Button className="SelectNetworkPanel-button" disabled={!validNetwork} onClick={onSubmit}>
          {translate('ADD_ACCOUNT_NETWORK_ACTION')}
        </Button>
      </div>
    </div>
  );
}

export default NetworkSelectPanel;
