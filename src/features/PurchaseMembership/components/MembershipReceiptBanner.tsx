import styled from 'styled-components';

import { SPACING } from '@theme';
import translate, { translateRaw } from '@translations';

import { IMembershipConfig } from '../config';
import { getExpiryDate } from '../helpers';

interface Props {
  membershipSelected: IMembershipConfig;
}

const Image = styled.img`
  height: 25px;
  margin-right: ${SPACING.SM};
  vertical-align: middle;
`;

const MembershipReceiptBanner = ({ membershipSelected }: Props) => {
  return (
    <div className="TransactionReceipt-row">
      <div className="TransactionReceipt-row-column">
        <Image src={membershipSelected.icon} />
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
