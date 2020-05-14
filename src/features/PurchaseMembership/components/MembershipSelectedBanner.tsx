import React, { useContext } from 'react';
import styled from 'styled-components';

import { translateRaw } from '@translations';
import { COLORS, SPACING, FONT_SIZE } from '@theme';
import { Typography, Tooltip } from '@components';
import { AssetContext } from '@services';
import { Asset } from '@types';
import { IMembershipConfig } from '../config';

interface Props {
  membershipSelected: IMembershipConfig;
}

const BannerContainer = styled.div`
  display: flex;
  flex: 1;
  padding: ${SPACING.BASE};
  flex-direction: row;
  background-color: ${COLORS.GREY_LIGHTEST};
  margin-bottom: ${SPACING.MD};
  justify-content: space-between;
`;

const MembershipWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const IconWrapper = styled.div`
  margin-right: ${SPACING.SM};
`;

const Icon = styled.img`
  width: 45px;
  height: 48px;
`;

const Price = styled(Typography)`
  font-size: ${FONT_SIZE.XL};
  color: ${COLORS.BLUE_DARK};
`;

const CostWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CostText = styled(Typography)`
  margin-right: ${SPACING.BASE};
`;

const MembershipSelectedBanner = ({ membershipSelected }: Props) => {
  const { assets } = useContext(AssetContext);
  const asset = assets.find((a) => a.uuid === membershipSelected.assetUUID) as Asset;
  return (
    <BannerContainer>
      <MembershipWrapper>
        <IconWrapper>
          <Icon src={membershipSelected.icon} />
        </IconWrapper>
        <div>
          <Typography as="div" bold={true}>
            {translateRaw('MEMBERSHIP_DETAILS')}
          </Typography>
          <Typography as="div">{membershipSelected.title}</Typography>
        </div>
      </MembershipWrapper>
      <CostWrapper>
        <CostText as="div">
          {translateRaw('COST')} <Tooltip tooltip={translateRaw('MEMBERSHIP_COST_TOOLTIP')} />
        </CostText>
        <Price as="div" bold={true}>
          {membershipSelected.price} {asset.ticker}
        </Price>
      </CostWrapper>
    </BannerContainer>
  );
};

export default MembershipSelectedBanner;
