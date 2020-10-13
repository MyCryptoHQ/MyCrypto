import React, { useContext } from 'react';

import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { DashboardPanel, SubHeading, Tooltip } from '@components';
import { DataContext } from '@services/Store';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import translate from '@translations';

const Divider = styled.div`
  height: 2px;
  margin-bottom: ${SPACING.BASE};
  background: ${COLORS.GREY_ATHENS};
`;

const SettingsField = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${SPACING.BASE} ${SPACING.BASE} ${SPACING.BASE};
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    display: block;
  }
`;

const SettingsControl = styled.div`
  button {
    margin-left: ${SPACING.SM};
  }
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin-top: ${SPACING.SM};
    width: 100%;
  }
`;

const SettingsButton = styled(Button)`
  width: 125px;
  padding: ${SPACING.SM};
`;

const DangerZone: React.FC = () => {
  const { resetAppDb } = useContext(DataContext);

  return (
    <DashboardPanel heading={translate('SETTINGS_DANGER_ZONE')}>
      <Divider style={{ borderBottom: '1px solid red' }} />
      <SettingsField>
        <SubHeading fontWeight="initial">
          {translate('SETTINGS_DB_RESET_LABEL')}{' '}
          <Tooltip tooltip={<span>{translate('SETTINGS_DANGER_ZONE_TOOLTIP')}</span>} />
        </SubHeading>
        <SettingsControl>
          <SettingsButton secondary={true} onClick={() => resetAppDb()}>
            {translate('SETTINGS_DB_RESET_ACTION')}
          </SettingsButton>
        </SettingsControl>
      </SettingsField>
    </DashboardPanel>
  );
};

export default DangerZone;
