import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import saveIcon from '@assets/images/icn-save-dash-board-settings.svg';
import { LinkApp } from '@components';
import { ROUTE_PATHS } from '@config';
import { BREAK_POINTS } from '@theme';
import translate from '@translations';

import NotificationWrapper from './NotificationWrapper';

const { SCREEN_XS } = BREAK_POINTS;

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

export default function SaveDashboardNotification() {
  return (
    <NotificationWrapper
      leftImg={{ src: saveIcon, width: 'auto', height: '100px' }}
      title={translate('NOTIFICATIONS_SAVE_DASHBOARD_TITLE')}
      description={translate('NOTIFICATIONS_SAVE_DASHBOARD_DESCRIPTION')}
      resources={
        <LinkApp href={ROUTE_PATHS.SETTINGS_EXPORT.path}>
          <ResourceItem secondary={true}>
            {translate('NOTIFICATIONS_SAVE_DASHBOARD_RESOURCE')}
          </ResourceItem>
        </LinkApp>
      }
    />
  );
}
