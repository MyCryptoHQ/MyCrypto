import React from 'react';

import styled from 'styled-components';

import { Typography } from '@components';
import { COLORS, FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';

import { getExpiryDate, IMembershipConfig } from '../config';

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
`;

const MembershipReceiptBanner = ({ membershipSelected }: Props) => {
  return (
    <div className="TransactionReceipt-row">
      <div className="TransactionReceipt-row-column">
        <Icon src={membershipSelected.icon} />
        {translate('MEMBERSHIP')}
      </div>
      <div className="TransactionReceipt-row-column rightAligned">
        {translateRaw('EXPIRES_ON')}
        {': '}
        {getExpiryDate(membershipSelected.key).toLocaleDateString()}
      </div>
    </div>
  );
};

export default MembershipReceiptBanner;
