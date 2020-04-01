import React from 'react';
import { IMembershipConfig, IMembershipId } from '../config';
import styled from 'styled-components';
import { Typography } from 'v2/components';
import { SPACING, COLORS, BREAK_POINTS } from 'v2/theme';

const PlanCard = styled.div<{ fullwith?: boolean }>`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: ${props => (props.fullwith ? '100%' : '48%')};
    margin-top: ${SPACING.SM};
    flex-direction: ${props => (props.fullwith ? 'row' : 'column')};
    justify-content: ${props => (props.fullwith ? 'space-evenly' : 'flex-start')};
    height: ${props => (props.fullwith ? '109px' : '212px')};
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 212px;
  width: 18%;
  padding: ${SPACING.SM};
  background-color: ${COLORS.WHITE};
  border-radius: 6px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.07);
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  & > * {
    padding-top: ${SPACING.SM};
  }
`;

const STypography = styled(Typography)`
  color: ${COLORS.BLUE_BRIGHT};
  font-style: italic;
`;

export default ({ plan }: { plan: IMembershipConfig }) => {
  const duration = plan.key !== IMembershipId.lifetime && Math.floor(plan.durationInDays / 30);
  return plan.key !== IMembershipId.lifetime ? (
    <PlanCard>
      <img src={plan.icon} />
      <Description>
        <Typography bold={true}>{`${duration} ${duration > 1 ? 'Mounths' : 'Mounth'}`}</Typography>
        <Typography>{`$${plan.price}`}</Typography>
        {plan.discount && <STypography>{`${plan.discount}% off!`}</STypography>}
      </Description>
    </PlanCard>
  ) : (
    <PlanCard fullwith={true}>
      <img src={plan.icon} />
      <Description>
        <Typography bold={true}>I Love MyCrypto</Typography>
        <Typography>{`$${plan.price}`}</Typography>
        <STypography>Lifetime of Love!</STypography>
      </Description>
    </PlanCard>
  );
};
