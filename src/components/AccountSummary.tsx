import React from 'react';
import styled from 'styled-components';

import { TSymbol, TUuid } from '@types';
import Currency from './Currency';
import Account from './Account';

interface StyleProps {
  paddingLeft?: string;
}
interface Props {
  address: string;
  uuid?: TUuid;
  balance?: string;
  assetSymbol?: string;
  label?: string;
  hideCurrency?: boolean;
  onClick?(): void;
}

const SCurrency = styled(Currency)`
  margin-left: 58px;
`;

// To change the hover behavior on Address, we need it to be a SC.
// https://www.styled-components.com/docs/advanced#caveat
const SAddress = styled(Account)``;

const SAccountWrapper = styled.div<StyleProps>`
  display: flex;
  padding: 16px 15px 16px 19px;
  ${({ paddingLeft }) => paddingLeft && `padding-left: ${paddingLeft};`}
  flex-direction: column;
  & > div {
    line-height: 1.2;
    color: var(--greyish-brown);
  }
  & > ${SAddress} {
    pointer-events: none;
  }
`;

// Display an address with it's balance
function AccountSummary({
  address,
  balance,
  assetSymbol,
  uuid,
  label,
  onClick,
  paddingLeft
}: Props & StyleProps) {
  return (
    <SAccountWrapper onPointerDown={onClick} paddingLeft={paddingLeft}>
      <SAddress title={label} truncate={true} address={address} isCopyable={false} />
      {balance && uuid && (
        <SCurrency
          amount={balance}
          symbol={(assetSymbol as TSymbol) || ('ETH' as TSymbol)}
          uuid={uuid}
          decimals={4}
          icon={true}
        />
      )}
    </SAccountWrapper>
  );
}

export default AccountSummary;
