import { FC, useState } from 'react';

import { Button } from '@mycrypto/ui';
import { AnyAction, bindActionCreators, Dispatch } from '@reduxjs/toolkit';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';

import { DashboardPanel, Divider, RowDeleteOverlay, SubHeading, Tooltip } from '@components';
import { appReset } from '@store';
import { BREAK_POINTS, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';

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

const SDashboardPanel = styled(DashboardPanel)`
  border: 1px solid ${({ theme }) => theme.colors.warning};
`;

const DangerZone: FC<Props> = ({ appReset }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <SDashboardPanel heading={translate('SETTINGS_DANGER_ZONE')}>
      <Divider mb={SPACING.BASE} />
      {confirmDelete ? (
        <RowDeleteOverlay
          prompt={translateRaw('DANGERZONE_CONFIRM')}
          deleteText={translateRaw('SETTINGS_DB_RESET_ACTION')}
          deleteAction={() => {
            appReset();
            setConfirmDelete(false);
          }}
          cancelAction={() => setConfirmDelete(false)}
        />
      ) : (
        <SettingsField>
          <SubHeading fontWeight="initial">
            {translate('SETTINGS_DB_RESET_LABEL')}{' '}
            <Tooltip
              width="16px"
              tooltip={<span>{translate('SETTINGS_DANGER_ZONE_TOOLTIP')}</span>}
            />
          </SubHeading>
          <SettingsControl>
            <SettingsButton secondary={true} onClick={() => setConfirmDelete(true)}>
              {translate('SETTINGS_DB_RESET_ACTION')}
            </SettingsButton>
          </SettingsControl>
        </SettingsField>
      )}
    </SDashboardPanel>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ appReset }, dispatch);

const connector = connect(null, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;
export default connector(DangerZone);
