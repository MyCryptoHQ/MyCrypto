import React, { useContext } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Typography } from '@mycrypto/ui';

import translate, { translateRaw } from 'v2/translations';
import { ContentPanel, Button, RouterLink } from 'v2/components';
import { SettingsContext } from 'v2/services/Store';
import { ROUTE_PATHS } from 'v2/config';
import { COLORS } from 'v2/theme';

import Downloader from './Downloader';

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

export function Export(props: RouteComponentProps<{}>) {
  const { history } = props;
  const onBack = history.goBack;
  const { exportStorage } = useContext(SettingsContext);
  const appStore = exportStorage();
  return (
    <CenteredContentPanel onBack={onBack} heading={translateRaw('SETTINGS_EXPORT_HEADING')}>
      <ImportSuccessContainer>
        <Typography>{translate('SETTINGS_EXPORT_INFO')}</Typography>
        <CacheDisplay>{appStore}</CacheDisplay>
        <RouterLink fullwidth={true} to={ROUTE_PATHS.SETTINGS.path}>
          <Button color={COLORS.WHITE} fullwidth={true}>
            {translate('SETTINGS_EXPORT_LEAVE')}
          </Button>
        </RouterLink>
        <Downloader appStore={appStore} />
      </ImportSuccessContainer>
    </CenteredContentPanel>
  );
}

export default withRouter(Export);
