import React, { useContext } from 'react';

import { Button, Icon } from '@mycrypto/ui';
import styled from 'styled-components';

import { DashboardPanel, Tooltip } from '@components';
import { DataContext } from '@services/Store';
import { BREAK_POINTS, COLORS, FONT_SIZE, SPACING } from '@theme';
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

const SettingsLabel = styled.div`
  display: flex;
  align-items: center;
  font-size: ${FONT_SIZE.LG};
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 100%;
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

const SettingsTooltipIcon = styled(Icon)`
  margin-left: ${SPACING.SM};
  height: 1em;
`;

const DangerZone: React.FC = () => {
  const { resetAppDb } = useContext(DataContext);

  return (
    <DashboardPanel heading={translate('SETTINGS_DANGER_ZONE')}>
      <Divider style={{ borderBottom: '1px solid red' }} />
      <SettingsField>
        <SettingsLabel>
          {translate('SETTINGS_DB_RESET_LABEL')}{' '}
          <Tooltip tooltip={<span>{translate('SETTINGS_DANGER_ZONE_TOOLTIP')}</span>}>
            <div>
              <SettingsTooltipIcon icon="shape" />
            </div>
          </Tooltip>
        </SettingsLabel>
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
