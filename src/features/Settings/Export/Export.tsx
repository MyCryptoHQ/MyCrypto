import React from 'react';

import { Typography } from '@mycrypto/ui';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { ContentPanel, Downloader } from '@components';
import { useSettings, useUserActions } from '@services/Store';
import translate, { translateRaw } from '@translations';
import { ACTION_NAME, ACTION_STATE } from '@types';

const CenteredContentPanel = styled(ContentPanel)`
  width: 35rem;
`;

const ImportSuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CacheDisplay = styled.code`
  overflow: auto;
  width: 100%;
  height: 10rem;
`;

export function Export(props: RouteComponentProps) {
  const { history } = props;
  const onBack = history.goBack;
  const { exportStorage } = useSettings();
  const data = exportStorage();
  const { updateUserAction, findUserAction } = useUserActions();

  const backupAction = findUserAction(ACTION_NAME.BACKUP);

  return (
    <CenteredContentPanel onBack={onBack} heading={translateRaw('SETTINGS_EXPORT_HEADING')}>
      <ImportSuccessContainer>
        <Typography>{translate('SETTINGS_EXPORT_INFO')}</Typography>
        <CacheDisplay>{data}</CacheDisplay>
        <Downloader
          data={data}
          onClick={() =>
            backupAction &&
            updateUserAction(backupAction.uuid, { ...backupAction, state: ACTION_STATE.COMPLETED })
          }
        />
      </ImportSuccessContainer>
    </CenteredContentPanel>
  );
}

export default withRouter(Export);
