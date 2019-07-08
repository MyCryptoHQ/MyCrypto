import React, { useContext } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Typography } from '@mycrypto/ui';

import translate, { translateRaw } from 'translations';
import { ContentPanel, Button, RouterLink } from 'v2/components';
import { SettingsContext } from 'v2/providers';
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
  const { getStorage } = useContext(SettingsContext);
  const store = String(getStorage());
  return (
    <CenteredContentPanel onBack={onBack} heading={translateRaw('SETTINGS_EXPORT_HEADING')}>
      <ImportSuccessContainer>
        <Typography>{translate('SETTINGS_EXPORT_INFO')}</Typography>
        <CacheDisplay>{store}</CacheDisplay>
        <RouterLink fullWidth={true} to="/settings">
          <Button fullWidth={true}>{translate('SETTINGS_EXPORT_LEAVE')}</Button>
        </RouterLink>
        <Downloader getStorage={getStorage} />
      </ImportSuccessContainer>
    </CenteredContentPanel>
  );
}

export default withRouter(Export);
