import React from 'react';

import { Typography } from '@mycrypto/ui';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { ContentPanel, Downloader, InlineMessage } from '@components';
import { getCurrentDBConfig, getExportFileName } from '@database';
import { useUserActions } from '@services/Store';
import { exportState, useSelector } from '@store';
import translate, { translateRaw } from '@translations';
import { ACTION_NAME, ACTION_STATE, InlineMessageType } from '@types';
import { goBack, useScreenSize } from '@utils';

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
  const onBack = () => goBack(history);
  const appState = JSON.stringify(useSelector(exportState));
  const { isMobile } = useScreenSize();

  const { updateUserAction, findUserAction } = useUserActions();

  const backupAction = findUserAction(ACTION_NAME.BACKUP);

  return (
    <ContentPanel width={560} onBack={onBack} heading={translateRaw('SETTINGS_EXPORT_HEADING')}>
      <ImportSuccessContainer>
        <Typography>{translate('SETTINGS_EXPORT_INFO')}</Typography>
        <CacheDisplay data-testid="export-json-display">{appState}</CacheDisplay>
        {isMobile && (
          <InlineMessage type={InlineMessageType.INFO_CIRCLE}>
            {translateRaw('EXPORT_MOBILE_NOTICE')}{' '}
          </InlineMessage>
        )}
        <Downloader
          fileName={getExportFileName(getCurrentDBConfig(), new Date())}
          data={appState}
          onClick={() =>
            backupAction &&
            updateUserAction(backupAction.uuid, { ...backupAction, state: ACTION_STATE.COMPLETED })
          }
        />
      </ImportSuccessContainer>
    </ContentPanel>
  );
}

export default withRouter(Export);
