import styled from 'styled-components';

import { Typography } from '@components';
import { getAssetByUUID, useAssets } from '@services/Store';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import { Asset } from '@types';

import { IMembershipConfig } from '../config';

const PlanCard = styled.div`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 48%;
    margin-top: ${SPACING.SM};
    flex-direction: column;
    justify-content: flex-start;
    height: 212px;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24%;
  padding: ${SPACING.BASE};
  background-color: ${COLORS.WHITE};
  border-radius: 6px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.07);
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  & > * {
    padding-top: ${SPACING.SM};
  }
`;

const STypography = styled(Typography)`
  color: ${COLORS.BLUE_BRIGHT};
  font-style: italic;
  text-align: center;
`;

export default ({ plan }: { plan: IMembershipConfig }) => {
  const { assets } = useAssets();
  const planAsset = getAssetByUUID(assets)(plan.assetUUID) ?? ({} as Asset);

  return (
    <PlanCard>
      <img src={plan.icon} />
      <Description>
        <Typography bold={true}>{plan.title}</Typography>
        <Typography>{`${plan.price} ${planAsset.ticker}`}</Typography>
        <STypography>{plan.discountNotice}</STypography>
      </Description>
    </PlanCard>
  );
};
