import React from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import translate from 'translations';
import { BREAK_POINTS } from 'v2/features/constants';
import NotificationWrapper from './NotificationWrapper';

// Legacy
import saveIcon from 'common/assets/images/icn-save-dash-board-settings.svg';

const { SCREEN_XS } = BREAK_POINTS;

const SaveImage = styled.img`
  width: 68px;
  height: 77px;
  margin-right: 30px;
`;

const ResourceItem = styled(Button)`
  width: 200px;
  padding-left: 0px;
  padding-right: 0px;
  font-weight: normal;
  font-size: 17px;

  @media (max-width: ${SCREEN_XS}) {
    font-size: 15px;
  }
`;

export default function WalletCreatedNotification() {
  return (
    <NotificationWrapper
      leftImg={<SaveImage src={saveIcon} />}
      title={translate('NOTIFICATIONS_SAVE_DASHBOARD_TITLE')}
      description={translate('NOTIFICATIONS_SAVE_DASHBOARD_DESCRIPTION')}
      resources={
        <ResourceItem secondary={true}>
          {translate('NOTIFICATIONS_SAVE_DASHBOARD_RESOURCE')}
        </ResourceItem>
      }
    />
  );
}
