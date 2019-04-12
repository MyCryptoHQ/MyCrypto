import React from 'react';
import styled from 'styled-components';
import { withRouter, Link } from 'react-router-dom';
import { Button, Typography } from '@mycrypto/ui';

import { Layout } from 'v2/features';
import { ContentPanel } from 'v2/components';

import { GlobalSettingsContext } from 'v2/providers';

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

const CacheDisplay = styled.code`
  overflow: auto;
  width: 100%;
  height: 10rem;
`;

export class Import extends React.Component<RouteComponentProps<{}>> {
  public state = { step: 0 };

  public render() {
    const { history } = this.props;
    const onBack = history.goBack;
    return (
      <Layout centered={true}>
        <GlobalSettingsContext.Consumer>
          {({ localCache }) => (
            <CenteredContentPanel onBack={onBack} heading="Export">
              <ImportSuccessContainer>
                <Typography>Your exported CSV file has been downloaded.</Typography>
                <CacheDisplay>{localCache}</CacheDisplay>
                <FullWidthLink to="/dashboard/settings">
                  <FullWidthButton>Back To Settings</FullWidthButton>
                </FullWidthLink>
              </ImportSuccessContainer>
            </CenteredContentPanel>
          )}
        </GlobalSettingsContext.Consumer>
      </Layout>
    );
  }
}

export default withRouter(Import);
