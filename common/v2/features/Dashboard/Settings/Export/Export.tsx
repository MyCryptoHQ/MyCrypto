import React from 'react';
import styled from 'styled-components';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import { Typography } from '@mycrypto/ui';
import translate, { translateRaw } from 'translations';

import { ContentPanel, Button } from 'v2/components';
import { Layout } from 'v2/features';

import { GlobalSettingsContext } from 'v2/providers';

import Downloader from './Downloader';

const CenteredContentPanel = styled(ContentPanel)`
  width: 35rem;
`;

const ImportSuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FullWidthLink = styled(Link)`
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
            <CenteredContentPanel onBack={onBack} heading={translateRaw('SETTINGS_EXPORT_HEADING')}>
              <ImportSuccessContainer>
                <Typography>{translate('SETTINGS_EXPORT_INFO')}</Typography>
                <CacheDisplay>{localCache}</CacheDisplay>
                <FullWidthLink to="/dashboard/settings">
                  <Button fullWidth={true}>{translate('SETTINGS_EXPORT_LEAVE')}</Button>
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
