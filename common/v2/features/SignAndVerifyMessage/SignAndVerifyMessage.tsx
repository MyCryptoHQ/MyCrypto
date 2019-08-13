import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { History } from 'history';
import styled from 'styled-components';

import { ExtendedContentPanel, Tabs } from 'v2/components';
import { ROUTE_PATHS } from 'v2/config';
import { Tab } from 'v2/types';
import { BREAK_POINTS } from 'v2/theme';
import translate from 'translations';
import { tabsConfig } from './constants';

const { SCREEN_SM } = BREAK_POINTS;

const HeadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  width: 600px;

  @media (max-width: ${SCREEN_SM}) {
    width: 100%;
    flex-direction: column;
    align-items: center;
  }
`;

const Title = styled.div`
  margin-bottom: 10px;

  @media (max-width: ${SCREEN_SM}) {
    width: 100%;
  }
`;

const SubTitle = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: normal;

  @media (max-width: ${SCREEN_SM}) {
    display: none;
  }
`;

const SubTitleMobile = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: normal;

  @media (min-width: ${SCREEN_SM}) {
    display: none;
  }
`;

const TabsWrapper = styled.div`
  max-height: 50px;
  width: fit-content;
`;

const tabClickRedirect = (history: History, url: string): void => {
  history.push(url);
};

function SignAndVerifyMessage(props: RouteComponentProps<{}>) {
  const { history, location } = props;

  const currentRoute = tabsConfig.find(
    tabConfig => ROUTE_PATHS[tabConfig.key].path === location.pathname
  );

  const tabs: Tab[] = tabsConfig.map(tabConfig => ({
    title: ROUTE_PATHS[tabConfig.key].title,
    onClick: () => tabClickRedirect(history, ROUTE_PATHS[tabConfig.key].path)
  }));

  return currentRoute ? (
    <ExtendedContentPanel
      heading={
        <HeadingWrapper>
          <Heading>
            <Title>{ROUTE_PATHS[currentRoute.key].title}</Title>
            <SubTitleMobile>{translate(currentRoute.subtitle)}</SubTitleMobile>
            <TabsWrapper>
              <Tabs
                tabs={tabs}
                selectedIndex={tabsConfig.findIndex(tab => tab.key === currentRoute.key)}
              />
            </TabsWrapper>
          </Heading>
          <SubTitle>{translate(currentRoute.subtitle)}</SubTitle>
        </HeadingWrapper>
      }
      maxWidth="750px"
    >
      <currentRoute.component />
    </ExtendedContentPanel>
  ) : (
    <></>
  );
}

export default withRouter(SignAndVerifyMessage);
