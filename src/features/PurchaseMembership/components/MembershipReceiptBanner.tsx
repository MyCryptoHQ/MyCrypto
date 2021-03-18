import React from 'react';

import styled from 'styled-components';

import translate, { translateRaw } from '@translations';

import { IMembershipConfig } from '../config';
import { getExpiryDate } from '../helpers';

interface Props {
  membershipSelected: IMembershipConfig;
}

const Icon = styled.img``;

const MembershipReceiptBanner = ({ membershipSelected }: Props) => {
  return (
    <div className="TransactionReceipt-row">
      <div className="TransactionReceipt-row-column">
        <Icon src={membershipSelected.icon} />
        {translate('X_MEMBERSHIP')}
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
