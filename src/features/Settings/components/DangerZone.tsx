import React, { useContext, useState } from 'react';

import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { DashboardPanel, RowDeleteOverlay, SubHeading, Tooltip } from '@components';
import { DataContext } from '@services/Store';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';

const Divider = styled.div`
  height: 2px;
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
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <DashboardPanel heading={translate('SETTINGS_DANGER_ZONE')}>
      <Divider
        style={{ borderBottom: '1px solid red', marginBottom: confirmDelete ? '0' : SPACING.BASE }}
      />

      {confirmDelete ? (
        <RowDeleteOverlay
          prompt={translateRaw('DANGERZONE_CONFIRM')}
          deleteText={translateRaw('SETTINGS_DB_RESET_ACTION')}
          deleteAction={() => {
            resetAppDb();
            setConfirmDelete(false);
          }}
          cancelAction={() => setConfirmDelete(false)}
        />
      ) : (
        <SettingsField>
          <SubHeading fontWeight="initial">
            {translate('SETTINGS_DB_RESET_LABEL')}{' '}
            <Tooltip tooltip={<span>{translate('SETTINGS_DANGER_ZONE_TOOLTIP')}</span>} />
          </SubHeading>
          <SettingsControl>
            <SettingsButton secondary={true} onClick={() => setConfirmDelete(true)}>
              {translate('SETTINGS_DB_RESET_ACTION')}
            </SettingsButton>
          </SettingsControl>
        </SettingsField>
      )}
    </DashboardPanel>
  );
};

export default DangerZone;
