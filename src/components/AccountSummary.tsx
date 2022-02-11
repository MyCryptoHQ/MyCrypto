import styled from 'styled-components';

import { TTicker, TUuid } from '@types';

import Account from './Account';
import Currency from './Currency';

interface StyleProps {
  paddingLeft?: string;
}
interface Props {
  address: string;
  uuid?: TUuid;
  balance?: string;
  assetTicker?: TTicker;
  label?: string;
  hideCurrency?: boolean;
  onClick?(): void;
}

const SCurrency = styled(Currency)`
  margin-left: 46px;
`;

// To change the hover behavior on Address, we need it to be a SC.
// https://www.styled-components.com/docs/advanced#caveat
const SAccount = styled(Account)``;

const SAccountWrapper = styled.div<StyleProps>`
  display: flex;
  padding: 16px 15px 16px 0px;
  ${({ paddingLeft }) => paddingLeft && `padding-left: ${paddingLeft};`}
  flex-direction: column;
  & > div {
    line-height: 1.2;
    color: var(--greyish-brown);
  }
  & > ${SAccount} {
    pointer-events: none;
  }
`;

// Display an address with it's balance
function AccountSummary({
  address,
  balance,
  assetTicker,
  uuid,
  label,
  onClick,
  paddingLeft
}: Props & StyleProps) {
  return (
    <SAccountWrapper onPointerDown={onClick} paddingLeft={paddingLeft}>
      <SAccount title={label} truncate={true} address={address} isCopyable={false} />
      {balance && uuid && (
        <SCurrency
          amount={balance}
          ticker={assetTicker ?? ('ETH' as TTicker)}
          uuid={uuid}
          decimals={4}
          icon={true}
        />
      )}
    </SAccountWrapper>
  );
}

export default AccountSummary;
