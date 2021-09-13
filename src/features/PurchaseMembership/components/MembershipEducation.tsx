import { Accordion } from '@mycrypto/ui';
import styled from 'styled-components';

import membershipIllustration from '@assets/images/membership/membership-illustration.svg';
import membershipLifetime from '@assets/images/membership/membership-lifetime.svg';
import membershipNoAds from '@assets/images/membership/membership-no-ads.svg';
import membershipNoSponsor from '@assets/images/membership/membership-no-sponsor.svg';
import membershipShirt from '@assets/images/membership/membership-shirt.svg';
import membershipStickers from '@assets/images/membership/membership-stickers.svg';
import membershipUnlimited from '@assets/images/membership/membership-unlimited-transaction.svg';
import { Button, FullSizeContentPanel, LinkApp, Typography } from '@components';
import { getKBHelpArticle, KB_HELP_ARTICLE, ROUTE_PATHS } from '@config';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import translate from '@translations';

import {
  FullSizePanelSection,
  RowPanelSection,
  SpacedPanelSection
} from '../../../components/FullSizeContentPanel';
import { accordionContent, IMembershipId, MEMBERSHIP_CONFIG } from '../config';
import MembershipPlanCard from './MembershipPlanCard';

const Heading = styled(FullSizePanelSection)`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: ${SPACING.BASE} ${SPACING.LG} 0 ${SPACING.XL};
  }
  display: flex;
  padding: ${SPACING.LG} ${SPACING.XL} 0 ${SPACING.XL};
  align-items: flex-start;
  font-size: 24px;
  font-weight: bold;
`;

const Title = styled.div`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_XS}) {
    font-size: 24px;
  }
  font-size: 32px;
  font-weight: bold;
`;

const SImg = styled.img`
  @media screen and (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    padding: 0 ${SPACING.XXL};
  }
  @media screen and (min-width: ${BREAK_POINTS.SCREEN_SM}) and (max-width: ${BREAK_POINTS.SCREEN_MD}) {
    padding-right: ${SPACING.LG};
  }

  width: 50%;
  height: auto;
  align-self: center;
`;

const DescriptionColumn = styled.div`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_MD}) {
    margin-top: ${SPACING.BASE};
  }
  display: flex;
  flex-direction: column;
  & > *:not(:first-child) {
    margin-top: ${SPACING.LG};
  }
`;

const SButton = styled(Button)`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 100%;
  }
  width: 250px;
`;

const SectionTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${SPACING.LG};
  & > :first-child {
    margin-bottom: ${SPACING.BASE};
  }
`;

const ListContainer = styled.div`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: column;
    align-items: center;
  }
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  margin-bottom: ${SPACING.LG};
`;

const ListRow = styled.div`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 90%;
  }
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.div`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 100%;
  }
  display: flex;
  align-items: center;
  min-width: 50%;
  margin: ${SPACING.SM} 0;
`;

const ListImg = styled.img`
  width: 30px;
  height: auto;
  margin-right: ${SPACING.XS};
`;

const PlanContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 90%;
  margin-bottom: ${SPACING.LG};
  & div {
    margin-bottom: 15px;
  }
  div:nth-child(odd) {
    margin-left: 15px;
    margin-right: 15px;
  }
`;

const MembershipDescription = styled(Typography)`
  margin-top: 1rem !important;
`;

const MembershipEducation = () => {
  return (
    <FullSizeContentPanel width={'1100px'}>
      <Heading>{translate('MEMBERSHIP')}</Heading>
      <RowPanelSection>
        <SImg src={membershipIllustration} />
        <DescriptionColumn>
          <MembershipDescription>{translate('MEMBERSHIP_DESC_FIRST')}</MembershipDescription>
          <MembershipDescription>{translate('MEMBERSHIP_DESC_SECOND')}</MembershipDescription>
          <MembershipDescription>{translate('MEMBERSHIP_DESC_THIRD')}</MembershipDescription>
          <LinkApp href={ROUTE_PATHS.MYC_MEMBERSHIP_BUY.path}>
            <SButton>{translate('BUY_MEMBERSHIP_NOW')}</SButton>
          </LinkApp>
        </DescriptionColumn>
      </RowPanelSection>
      <SpacedPanelSection color={COLORS.GREY_LIGHTEST}>
        <SectionTitle>
          <Title>{translate('SUPPORT_MYC')}</Title>
          <Typography>{translate('SUPPORT_MYC_DESC')}</Typography>
        </SectionTitle>
        <Title>{translate('WHAT_I_GET')}</Title>
        <ListContainer>
          <ListRow>
            <ListItem>
              <ListImg src={membershipLifetime} />
              <Typography>{translate('MEMBERSHIP_LIST_FIRST')}</Typography>
            </ListItem>
            <ListItem>
              <ListImg src={membershipUnlimited} />
              <Typography>{translate('MEMBERSHIP_LIST_THIRD_1')}</Typography>&nbsp;
              <LinkApp
                href={getKBHelpArticle(KB_HELP_ARTICLE.WHAT_ARE_PROTECTED_TRANSACTIONS)}
                isExternal={true}
              >
                {translate('MEMBERSHIP_LIST_THIRD_2')}
              </LinkApp>
            </ListItem>
            <ListItem>
              <ListImg src={membershipNoAds} />
              <Typography>{translate('MEMBERSHIP_LIST_FIFTH')}</Typography>
            </ListItem>
          </ListRow>
          <ListRow>
            <ListItem>
              <ListImg src={membershipNoSponsor} />
              <Typography>{translate('MEMBERSHIP_LIST_SECOND')}</Typography>
            </ListItem>
            <ListItem>
              <ListImg src={membershipStickers} />
              <Typography>{translate('MEMBERSHIP_LIST_FORTH')}</Typography>
            </ListItem>
            <ListItem>
              <ListImg src={membershipShirt} />
              <Typography>{translate('MEMBERSHIP_LIST_SIX')}</Typography>
            </ListItem>
          </ListRow>
        </ListContainer>
        <Title>{translate('WHAT_IT_COST')}</Title>
        <PlanContainer>
          {Object.values(MEMBERSHIP_CONFIG)
            .filter(({ disabled }) => !disabled)
            .map((membershipConfig) => (
              <MembershipPlanCard
                key={membershipConfig.key}
                plan={MEMBERSHIP_CONFIG[membershipConfig.key as IMembershipId]}
              />
            ))}
        </PlanContainer>
        <LinkApp href={ROUTE_PATHS.MYC_MEMBERSHIP_BUY.path}>
          <SButton>{translate('BUY_MEMBERSHIP_NOW')}</SButton>
        </LinkApp>
      </SpacedPanelSection>
      <SpacedPanelSection>
        <Title>{translate('ZAP_QUESTIONS_HEADER')}</Title>
        <Accordion items={accordionContent} />
        <Typography as="div">{translate('MEMBERSHIP_MORE_FAQ')}</Typography>
        <LinkApp href={ROUTE_PATHS.MYC_MEMBERSHIP_BUY.path}>
          <SButton>{translate('BUY_MEMBERSHIP_NOW')}</SButton>
        </LinkApp>
      </SpacedPanelSection>
    </FullSizeContentPanel>
  );
};

export default MembershipEducation;
