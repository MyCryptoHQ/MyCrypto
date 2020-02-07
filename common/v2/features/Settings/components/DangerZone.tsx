import React, { useContext } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { COLORS, SPACING, BREAK_POINTS, FONT_SIZE } from 'v2/theme';
import translate from 'v2/translations';
import { DataContext } from 'v2/services/Store';
import { DashboardPanel } from 'v2/components';

const Divider = styled.div`
  height: 2px;
  margin-bottom: 15px;
  background: ${COLORS.GREY_ATHENS};
`;

const SettingsField = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px 29px 30px;
  @media (max-width: 700px) {
    display: block;
  }
`;

const SettingsLabel = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 700px) {
  font-size: ${FONT_SIZE.LG};
    width: 100%;
  }
`;

const SettingsControl = styled.div`
  button {
    margin-left: 15px;
  }
  @media (max-width: 700px) {
    margin-top: 15px;
    width: 100%;
  }
`;

const SettingsButton = styled(Button)`
  width: 105px;
  padding: 12px 12px;
`;

const DangerZone: React.FC = () => {
  const { resetAppDb } = useContext(DataContext);

  return (
    <DashboardPanel heading={translate('SETTINGS_DANGER_ZONE')}>
      <Divider style={{ borderBottom: '1px solid red' }} />
      <SettingsField>
        <SettingsLabel>{translate('SETTINGS_DB_RESET_LABEL')}</SettingsLabel>
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
