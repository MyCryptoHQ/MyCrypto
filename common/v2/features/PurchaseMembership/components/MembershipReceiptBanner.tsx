import React from 'react';
import styled from 'styled-components';

import { translateRaw } from 'v2/translations';
import { COLORS, SPACING, FONT_SIZE } from 'v2/theme';
import { IMembershipConfig } from '../config';
import { Typography } from 'v2/components';

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
  justify-content: center;
`;

const MembershipWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const IconWrapper = styled.div`
  margin-right: ${SPACING.SM};
`;

const Icon = styled.img``;

const Header = styled(Typography)`
  font-size: ${FONT_SIZE.LG};
  font-weight: bold;
`;

const ExpiryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const MembershipReceiptBanner = ({ membershipSelected }: Props) => {
  const today = new Date();
  const expiration = new Date(today.getTime() + 86400000 * membershipSelected.durationInDays);
  return (
    <BannerContainer>
      <MembershipWrapper>
        <IconWrapper>
          <Icon src={membershipSelected.icon} />
        </IconWrapper>
        <div>
          <Header as="div">{translateRaw('NEW_MEMBER')}</Header>
          <ExpiryWrapper>
            <Typography as="div">
              {translateRaw('EXPIRES_ON')}
              {': '}
              {expiration.toLocaleDateString()}
            </Typography>
          </ExpiryWrapper>
        </div>
      </MembershipWrapper>
    </BannerContainer>
  );
};

export default MembershipReceiptBanner;
