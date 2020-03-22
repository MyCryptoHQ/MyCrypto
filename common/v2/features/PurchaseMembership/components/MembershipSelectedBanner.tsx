import React from 'react';
import styled from 'styled-components';

import { translateRaw } from 'v2/translations';
import { COLORS, SPACING, BREAK_POINTS, FONT_SIZE, LINE_HEIGHT } from 'v2/theme';
import { IMembershipConfig } from '../config';
import { Typography, Tooltip } from 'v2/components';

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
          {translateRaw('COST')} <Tooltip tooltip="TODO" />
        </CostText>
        <Price as="div" bold={true}>
          {membershipSelected.price} {'DAI'}
        </Price>
      </CostWrapper>
    </BannerContainer>
  );
};

export default MembershipSelectedBanner;
