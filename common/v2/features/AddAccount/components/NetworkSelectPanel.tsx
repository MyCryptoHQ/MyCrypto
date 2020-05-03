import React, { useState, useContext } from 'react';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import translate from 'v2/translations';
import { FormDataActionType as ActionType } from '../types';
import { FormData, NetworkId } from 'v2/types';
import { NetworkSelectDropdown } from 'v2/components';
import { ANALYTICS_CATEGORIES, AnalyticsService } from 'v2/services';
import { NetworkContext } from 'v2/services/Store';
import { SPACING } from 'v2/theme';

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
  const { networks } = useContext(NetworkContext);
  const [network, setNetwork] = useState<NetworkId>(formData.network);

  const onSubmit = () => {
    formDispatch({
      type: ActionType.SELECT_NETWORK,
      payload: { network }
    });
    AnalyticsService.instance.track(ANALYTICS_CATEGORIES.SELECT_NETWORK, network);
    goToNextStep();
  };

  const validNetwork = networks.some((n) => n.id === network);

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
