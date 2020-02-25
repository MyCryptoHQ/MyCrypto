import React from 'react';
import styled from 'styled-components';

import { truncate } from 'v2/utils';
import { TSymbol } from 'v2/types';
import Currency from './Currency';
import Account from './Account';

interface Props {
  address: string;
  balance?: string;
  assetSymbol?: string;
  label?: string;
  selectable?: boolean;
  hideCurrency?: boolean;
  onClick?(): void;
}

interface SProps {
  selectable: boolean;
}

const SCurrency = styled(Currency)`
  margin-left: 58px;
`;
// To change the hover behavior on Address, we need it to be a SC.
// https://www.styled-components.com/docs/advanced#caveat
const SAddress = styled(Account)``;

const SAccountWrapper = styled('div')`
  display: flex;
  padding: 16px 15px 16px 19px;
  flex-direction: column;
  & > div {
    line-height: 1.2;
    color: var(--greyish-brown);
  }
  & > ${SAddress} {
    pointer-events: none;
  }
  &:hover {
    background-color: ${(p: SProps) => (p.selectable ? 'var(--color-gray-lighter)' : 'inherit')};
  }
`;

// Display an address with it's balance
function AccountSummary({
  address,
  balance,
  assetSymbol,
  label,
  selectable = true,
  onClick
}: Props) {
  return (
    <SAccountWrapper onPointerDown={onClick} selectable={selectable}>
      <SAddress title={label} truncate={truncate} address={address} isCopyable={false} />
      {balance && (
        <SCurrency
          amount={balance}
          symbol={(assetSymbol as TSymbol) || ('ETH' as TSymbol)}
          decimals={4}
          icon={true}
        />
      )}
    </SAccountWrapper>
  );
}

export default AccountSummary;
