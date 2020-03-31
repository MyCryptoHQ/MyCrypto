import React from 'react';
import { IMembershipConfig, IMembershipId } from '../config';
import styled from 'styled-components';
import { Typography } from 'v2/components';
import { SPACING, COLORS } from 'v2/theme';

const PlanCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 212px;
  width: 18%;
  padding: ${SPACING.SM};
  background-color: ${COLORS.WHITE};
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.07);
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
  return (
    <PlanCard>
      <img src={plan.icon} />
      {plan.key !== IMembershipId.lifetime ? (
        <Typography bold={true}>{`${duration} ${duration > 1 ? 'Mounths' : 'Mounth'}`}</Typography>
      ) : (
        <Typography bold={true}>I Love MyCrypto</Typography>
      )}
      <Typography>{`$${plan.price}`}</Typography>
      {plan.key !== IMembershipId.lifetime ? (
        plan.discount && <STypography>{`${plan.discount}% off!`}</STypography>
      ) : (
        <STypography>Lifetime of Love!</STypography>
      )}
    </PlanCard>
  );
};
