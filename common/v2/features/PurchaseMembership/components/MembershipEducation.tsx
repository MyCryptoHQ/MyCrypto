import React from 'react';
import styled from 'styled-components';
import { withRouter, Link } from 'react-router-dom';
import { FullSizeContentPanel, Button, Typography } from 'v2/components';
import {
  FullSizePanelSection,
  SpacedPanelSection,
  RowPanelSection
} from '../../../components/FullSizeContentPanel';
import translate from 'v2/translations';
import { BREAK_POINTS, SPACING, COLORS } from 'v2/theme';
import { MEMBERSHIP_CONFIG, IMembershipId, accordionContent } from '../config';
import { MembershipPlanCard } from '.';
import membershipIllustration from 'assets/images/membership/membership-illustration.svg';
import { ROUTE_PATHS } from 'v2/config';

import membershipLifetime from 'assets/images/membership/membership-lifetime.svg';
import membershipUnlimited from 'assets/images/membership/membership-unlimited-transaction.svg';
import membershipNoAds from 'assets/images/membership/membership-no-ads.svg';
import membershipNoSponsor from 'assets/images/membership/membership-no-sponsor.svg';
import membershipStickers from 'assets/images/membership/membership-stickers.svg';
import membershipShirt from 'assets/images/membership/membership-shirt.svg';
import { Accordion } from '@mycrypto/ui';

const Heading = styled(FullSizePanelSection)`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  display: flex;
  align-items: flex-start;
  font-size: 24px;
  font-weight: bold;
`;

const SImg = styled.img`
  padding: 0 ${SPACING.XXL};
`;

const DescriptionColumn = styled.div`
  display: flex;
  flex-direction: column;
  & > *:not(:first-child) {
    margin-top: ${SPACING.LG};
  }
`;

const SButton = styled(Button)`
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
  justify-content: space-between;
  width: 100%;
  margin-bottom: ${SPACING.LG};
`;

const Disclaimer = styled(Typography)`
  color: ${COLORS.GREY};
  width: 80%;
  text-align: center;
`;

const MembershipEducation = withRouter(({ history }) => {
  const handleSubmit = () => history.push(`${ROUTE_PATHS.MYC_MEMBERSHIP.path}/buy`);
  return (
    <FullSizeContentPanel width={'1100px'}>
      <Heading>{translate('MEMBERSHIP')}</Heading>
      <RowPanelSection>
        <SImg src={membershipIllustration} />
        <DescriptionColumn>
          <Typography as="div">{translate('MEMBERSHIP_DESC_FIRST')}</Typography>
          <Typography as="div">{translate('MEMBERSHIP_DESC_SECOND')}</Typography>
          <SButton onClick={handleSubmit}>{translate('BUY_MEMBERSHIP_NOW')}</SButton>
        </DescriptionColumn>
      </RowPanelSection>
      <SpacedPanelSection color={COLORS.GREY_LIGHTEST}>
        <SectionTitle>
          <Typography fontSize={'32px'} bold={true}>
            {translate('SUPPORT_MYC')}
          </Typography>
          <Typography>{translate('SUPPORT_MYC_DESC')}</Typography>
        </SectionTitle>
        <Typography fontSize={'32px'} bold={true}>
          {translate('WHAT_I_GET')}
        </Typography>
        <ListContainer>
          <ListRow>
            <ListItem>
              <ListImg src={membershipLifetime} />
              <Typography>{translate('MEMBERSHIP_LIST_FIRST')}</Typography>
            </ListItem>
            <ListItem>
              <ListImg src={membershipUnlimited} />
              <Typography>{translate('MEMBERSHIP_LIST_THIRD_1')}</Typography>
              <Link to={ROUTE_PATHS.DASHBOARD.path}>{translate('MEMBERSHIP_LIST_THIRD_2')}</Link>
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
        <Typography fontSize={'32px'} bold={true}>
          {translate('WHAT_IT_COST')}
        </Typography>
        <PlanContainer>
          {Object.keys(MEMBERSHIP_CONFIG).map(key => (
            <MembershipPlanCard key={key} plan={MEMBERSHIP_CONFIG[key as IMembershipId]} />
          ))}
        </PlanContainer>
        <SButton onClick={handleSubmit}>{translate('BUY_MEMBERSHIP_NOW')}</SButton>
        <Disclaimer>{translate('MEMBERSHIP_NOTE')}</Disclaimer>
      </SpacedPanelSection>
      <SpacedPanelSection>
        <Typography fontSize={'32px'} bold={true}>
          {translate('ZAP_QUESTIONS_HEADER')}
        </Typography>
        <Accordion items={accordionContent} />
        <Typography as="div">{translate('MEMBERSHIP_MORE_FAQ')}</Typography>
        <SButton onClick={handleSubmit}>{translate('BUY_MEMBERSHIP_NOW')}</SButton>
      </SpacedPanelSection>
    </FullSizeContentPanel>
  );
});

export default MembershipEducation;
