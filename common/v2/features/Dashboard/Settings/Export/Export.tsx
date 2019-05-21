import React from 'react';
import styled from 'styled-components';
import { withRouter, Link } from 'react-router-dom';
import { Button, Typography } from '@mycrypto/ui';
import translate, { translateRaw } from 'translations';

import { Layout } from 'v2/features';
import { ContentPanel } from 'v2/components';

import { GlobalSettingsContext } from 'v2/providers';

import { makeBlob } from 'utils/blob';

import Downloader from './Downloader';

const CenteredContentPanel = styled(ContentPanel)`
  width: 35rem;
`;

const ImportSuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FullWidthButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
`;

const FullWidthLink = styled(Link)`
  width: 100%;
`;

const FullWidthDownloadLink = styled.a`
  width: 100%;
`;

const CacheDisplay = styled.code`
  overflow: auto;
  width: 100%;
  height: 10rem;
`;

export class Export extends React.Component<RouteComponentProps<{}>> {
  public render() {
    const { history } = this.props;
    const onBack = history.goBack;
    return (
      <Layout centered={true}>
        <GlobalSettingsContext.Consumer>
          {({ localCache, readCache }) => (
            <CenteredContentPanel onBack={onBack} heading={translate('SETTINGS_EXPORT_HEADING')}>
              <ImportSuccessContainer>
                <Typography>{translate('SETTINGS_EXPORT_INFO')}</Typography>
                <CacheDisplay>{localCache}</CacheDisplay>
                <FullWidthLink to="/dashboard/settings">
                  <FullWidthButton>{translate('SETTINGS_EXPORT_LEAVE')}</FullWidthButton>
                </FullWidthLink>
                <Downloader cache={localCache} readCache={readCache} />
              </ImportSuccessContainer>
            </CenteredContentPanel>
          )}
        </GlobalSettingsContext.Consumer>
      </Layout>
    );
  }
}

export default withRouter(Export);
