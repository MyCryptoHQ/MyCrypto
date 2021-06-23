import { useState } from 'react';

import { History } from 'history';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { ExtendedContentPanel, Tabs } from '@components';
import { ROUTE_PATHS } from '@config';
import { BREAK_POINTS } from '@theme';
import translate from '@translations';
import { Tab } from '@types';

import { tabsConfig } from './constants';

const { SCREEN_SM } = BREAK_POINTS;

const HeadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  @media (max-width: ${SCREEN_SM}) {
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
  align-self: flex-start;

  @media (min-width: ${SCREEN_SM}) {
    display: none;
  }
`;

const TabsWrapper = styled.div`
  max-height: 50px;
  margin-top: 8px;
  width: fit-content;
`;

const tabClickRedirect = (history: History<unknown>, url: string): void => {
  history.push(url);
};

function SignAndVerifyMessage({ history, location }: RouteComponentProps) {
  const [showSubtitle, setShowSubtitle] = useState(true);

  const currentRoute = tabsConfig.find(
    (tabConfig) => ROUTE_PATHS[tabConfig.key].path === location.pathname
  );

  const tabs: Tab[] = tabsConfig.map((tabConfig) => ({
    title: ROUTE_PATHS[tabConfig.key].title,
    onClick: () => tabClickRedirect(history, ROUTE_PATHS[tabConfig.key].path)
  }));

  return currentRoute ? (
    <ExtendedContentPanel
      heading={
        <HeadingWrapper>
          <Heading>
            <Title>{ROUTE_PATHS[currentRoute.key].title}</Title>
            {showSubtitle && <SubTitleMobile>{translate(currentRoute.subtitle)}</SubTitleMobile>}
            <TabsWrapper>
              <Tabs
                tabs={tabs}
                selectedIndex={tabsConfig.findIndex((tab) => tab.key === currentRoute.key)}
              />
            </TabsWrapper>
          </Heading>
          {showSubtitle && <SubTitle>{translate(currentRoute.subtitle)}</SubTitle>}
        </HeadingWrapper>
      }
      width="850px"
    >
      <currentRoute.component setShowSubtitle={setShowSubtitle} />
    </ExtendedContentPanel>
  ) : (
    <></>
  );
}

export default withRouter(SignAndVerifyMessage);
