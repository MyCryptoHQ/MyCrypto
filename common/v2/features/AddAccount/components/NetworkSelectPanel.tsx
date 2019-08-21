import React, { useState } from 'react';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import './NetworkSelectPanel.scss';

import { translate } from 'translations';
import { FormDataActionType as ActionType } from '../types';
import { FormData } from 'v2/types';
import { NetworkSelectDropdown } from 'v2/components';

const NetworkForm = styled.div`
  margin-top: 22px;
`;

interface Props {
  formData: FormData;
  formDispatch: any;
  goToNextStep(): void;
}

function NetworkSelectPanel({ formData, formDispatch, goToNextStep }: Props) {
  const [network, setNetwork] = useState(formData.network);

  const onSubmit = () => {
    formDispatch({
      type: ActionType.SELECT_NETWORK,
      payload: { network }
    });
    goToNextStep();
  };

  return (
    <div className="Panel">
      <div className="Panel-title">{translate('ADD_ACCOUNT_NETWORK_TITLE')}</div>
      <div className="Panel-description" id="NetworkPanel-description">
        {translate('ADD_ACCOUNT_NETWORK_SELCT')}
      </div>
      <NetworkForm>
        <NetworkSelectDropdown
          network={network}
          accountType={formData.accountType}
          onChange={setNetwork}
        />
      </NetworkForm>
      <div className="SelectNetworkPanel-button-container">
        <Button className="SelectNetworkPanel-button" onClick={onSubmit}>
          {translate('ADD_ACCOUNT_NETWORK_ACTION')}
        </Button>
      </div>
    </div>
  );
}

export default NetworkSelectPanel;
