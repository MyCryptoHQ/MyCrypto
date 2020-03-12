import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import {
  Button,
  ExtendedContentPanel,
  AppLogo,
  Typography,
  TranslateMarkdown,
  Link
} from 'v2/components';
import { ROUTE_PATHS } from 'v2/config';
import { COLORS, BREAK_POINTS, SPACING } from 'v2/theme';

import { ZAPS_CONFIG, IZapId, defaultZapId, riskAndReward, accordionContent } from '../config';
import { DetailsList, RiskAndRewardCard } from '.';
import sEth from 'assets/images/defizap/illustrations/seth.svg';
import { Accordion } from '@mycrypto/ui';

const FullSizeContentPanel = styled(ExtendedContentPanel)`
  padding: 0px;
`;

const SSection = styled.section<{ color?: string }>`
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: column;
    padding: 0;
    padding: ${SPACING.LG} ${SPACING.BASE};
    align-items: center;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${props => (props.color ? props.color : 'inherit')};
  width: 100%;
  padding: ${SPACING.LG} ${SPACING.XL};
`;

const ContentPanelHeading = styled(SSection)`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: column;
  }
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.div`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  display: flex;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
`;

const BreakdownImg = styled.img`
  max-width: 32px;
  margin-right: ${SPACING.SM};
`;

const DetailsSection = styled(SSection)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const SpacedSection = styled(SSection)`
  & > * {
    margin: ${SPACING.BASE} 0;
  }
`;

const CardContainer = styled.div`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: column;
    align-items: center;
  }
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: ${SPACING.SM} 0;
`;

const ZapEducation = withRouter(({ history, location }) => {
  const qs = queryString.parse(location.search);
  const detectedZapId: IZapId = qs.key;
  const [zapSelected, setZapSelected] = useState(
    qs.key ? ZAPS_CONFIG[detectedZapId] || ZAPS_CONFIG[defaultZapId] : ZAPS_CONFIG[defaultZapId]
  );

  const handleSubmit = () => {
    if (!zapSelected) return;
    history.push(`${ROUTE_PATHS.DEFIZAP.path}/${zapSelected.key}`);
  };

  useEffect(() => {
    if (detectedZapId && ZAPS_CONFIG[detectedZapId] !== zapSelected && ZAPS_CONFIG[detectedZapId]) {
      setZapSelected(ZAPS_CONFIG[detectedZapId]);
    } else if (!detectedZapId || !ZAPS_CONFIG[detectedZapId]) {
      setZapSelected(ZAPS_CONFIG[defaultZapId]);
    }
  }, [qs]);

  // Changes to new ZapSelection page with zap.
  // const handleZapSelected = (option: any) => {
  //   history.push(`${ROUTE_PATHS.DEFIZAP.path}/zap?key=${option.key}`);
  // };

  return (
    <FullSizeContentPanel width={'1100px'}>
      <ContentPanelHeading>
        <Title>
          <BreakdownImg src={zapSelected.breakdownImage} />
          {`${zapSelected.title} Details`}
        </Title>
        <AppLogo />
      </ContentPanelHeading>
      <DetailsSection>
        <img src={sEth} />
        <DetailsList onSubmit={handleSubmit} zapSelected={zapSelected} />
      </DetailsSection>
      <SpacedSection color={COLORS.GREY_LIGHTEST}>
        <Title>{'How Does Zap Work?'}</Title>
        <img src={sEth} />
        <Button onClick={handleSubmit}>Add Funds</Button>
      </SpacedSection>
      <SSection>
        <Title>{'Risks and Rewards when using DeFi Zap'}</Title>
        <CardContainer>
          {riskAndReward.map((el, i) => (
            <RiskAndRewardCard key={i} riskAndReward={el} />
          ))}
        </CardContainer>
      </SSection>
      <SpacedSection color={COLORS.GREY_LIGHTEST}>
        <Title>More Information About DeFi Zaps</Title>
        <Typography>
          Polis moore thrawn kanos. Cato altyr trianii firrerreo momaw orrin subterrel darth coway.
          Kessel porkins kessel togruta cracken huk rhen priapulin. Jin'ha coway gilad kendal phlog.
          Kyle elom jinn raynar moff quarren. Verpine chagrian porkins twi'lek ackbar corran.
          Xanatos taung darth vurk. Kamino kamino ken tyber walon. R2-d2 boba mirialan max. Polis
          tc-14 thennqora mandalorians jabiimas boba. Porkins moff typho md-5. Dash skywalker nunb
          cabasshite veknoid luke conan. Boz habassa mandalore lannik iblis utapau cabasshite vor.
        </Typography>
        <Typography>
          Jin'ha lars maris rahm gamorrean thul boss antilles ansionian. Gank iego yané jettster.
          Bardan nar veila grievous valorum tatooine polis grievous annoo. Wharl biggs ziro desolous
          thakwaash anzati. Fode desolous talortai ysanne altyr aparo taun jerjerrod. Lowbacca
          jubnuk tatooine vel var ima-gun toydarian alderaan tusken raider. Defel cal ev-9d9 klivian
          aleena. Hapan ysanne ventress han. Antemeridian golda darth vurk moff dengar ruwee jin'ha
          tenel. Conan darth subterrel doldur atrivis kuat teneniel wookiee.
        </Typography>
        <LinkContainer>
          <RowContainer>
            <Typography bold={true}>More from the Knowledgebase:</Typography>
          </RowContainer>
          <RowContainer>
            <Link href="https://example.com">Some Link</Link>
            <Link href="https://example.com">Some Link</Link>
            <Link href="https://example.com">Some Link</Link>
          </RowContainer>
          <RowContainer>
            <Link href="https://example.com">Some Link</Link>
            <Link href="https://example.com">Some Link</Link>
            <Link href="https://example.com">Some Link</Link>
          </RowContainer>
        </LinkContainer>
      </SpacedSection>
      <SpacedSection>
        <Title>Frequently Asked Questions</Title>
        <Accordion items={accordionContent} />
        <div>
          <TranslateMarkdown
            source={'To view more Frequently Asked Questions go [here](https://exemple.com).'}
          />
        </div>
        <Button onClick={handleSubmit}>Add Founds</Button>
      </SpacedSection>
    </FullSizeContentPanel>
  );
});

export default ZapEducation;
