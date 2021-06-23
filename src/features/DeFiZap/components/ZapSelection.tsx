import { useEffect, useState } from 'react';

import { Accordion } from '@mycrypto/ui';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { AppLogo, Button, FullSizeContentPanel, Typography } from '@components';
import { ROUTE_PATHS } from '@config';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';

import { FullSizePanelSection, SpacedPanelSection } from '../../../components/FullSizeContentPanel';
import { accordionContent, defaultZapId, IZapId, riskAndReward, ZAPS_CONFIG } from '../config';
import RiskAndRewardCard from './RiskAndRewardCard';

const Illustration = styled.img`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    display: none;
  }
`;

const MobileIllustration = styled.img`
  display: none;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    display: inherit;
  }
`;

const DetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${SPACING.SM};
`;

const ContentPanelHeading = styled(FullSizePanelSection)`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: column-reverse;
    padding-top: ${SPACING.BASE};
  }
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 0;
`;

const Title = styled.div`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_XS}) {
    font-size: 22px;
  }
  display: flex;
  align-items: flex-start;
  font-size: 32px;
  font-weight: bold;
`;

const TitleContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const SubTitle = styled.div`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_XS}) {
    font-size: 14px;
  }
  font-size: 20px;
  font-weight: normal;
  color: ${COLORS.GREY};
`;

const LogoContainer = styled.div`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    align-self: flex-end;
    margin-bottom: ${SPACING.BASE};
  }
`;

const BreakdownImg = styled.img`
  max-width: 32px;
  margin-right: ${SPACING.SM};
  margin-top: ${SPACING.XS};
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

// To re-activate later when we have content links
// const LinkContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: 100%;
// `;
// const RowContainer = styled.div`
//   display: flex;
//   justify-content: space-between;
//   width: 100%;
//   margin: ${SPACING.SM} 0;
// `;

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
          <TitleContent>
            {zapSelected.title}
            <SubTitle>{zapSelected.name}</SubTitle>
          </TitleContent>
        </Title>
        <LogoContainer>
          <AppLogo />
        </LogoContainer>
      </ContentPanelHeading>
      <SpacedPanelSection color={COLORS.WHITE}>
        <DetailsSection>
          <Illustration src={zapSelected.illustration} width={'100%'} />
          <Typography>{translateRaw('ZAP_DASHBOARD_PANEL_FOOTER')}</Typography>
        </DetailsSection>
        <Button onClick={handleSubmit}>{translate('ZAP_START_EARNING')}</Button>
        <MobileIllustration src={zapSelected.mobileIllustration} />
      </SpacedPanelSection>
      <FullSizePanelSection color={COLORS.GREY_LIGHTEST}>
        <Title>{translate('ZAP_RISKS_HEADER')}</Title>
        <CardContainer>
          {riskAndReward.map((el, i) => (
            <RiskAndRewardCard key={i} riskAndReward={el} />
          ))}
        </CardContainer>
      </FullSizePanelSection>
      <SpacedPanelSection color={COLORS.WHITE}>
        <Title>{translate('ZAP_MORE_INFO_HEADER')}</Title>
        <Typography>{translate('DEFI_DESC_FIRST')}</Typography>
        <Typography>{translate('DEFI_DESC_SECOND')}</Typography>
        <Typography>{translate('DEFI_DESC_THIRD')}</Typography>
        <Typography>{translate('VISIT_DEFIZAP')}</Typography>
      </SpacedPanelSection>
      <SpacedPanelSection>
        <Title>{translate('ZAP_QUESTIONS_HEADER')}</Title>
        <Accordion items={accordionContent} />
        {/* To re-activate later when we have content
        <div>
          <TranslateMarkdown
            source={'To view more Frequently Asked Questions go [here](https://exemple.com).'}
          />
        </div> */}
        <Button onClick={handleSubmit}>{translate('ZAP_ADD_FUNDS')}</Button>
      </SpacedPanelSection>
    </FullSizeContentPanel>
  );
});

export default ZapEducation;
