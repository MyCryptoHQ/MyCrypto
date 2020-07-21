import React from 'react';
import styled from 'styled-components';

import { TSymbol, TUuid } from '@types';
import { AssetIcon, Typography } from '@components';

const SContainer = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 14px 15px 14px 15px;
`;

function AssetDropdownItem({ uuid, symbol, name, onClick }: Props) {
  return (
    <SContainer
      {...(onClick ? { onPointerDown: onClick } : null)}
      data-testid={`asset-dropdown-option-${symbol}`}
    >
      <AssetIcon uuid={uuid} size={'1.5rem'} />
      <Typography bold={true} value={symbol} style={{ marginLeft: '10px' }} />
      {name && <span>&nbsp; - &nbsp;</span>}
      <Typography value={name} />
    </SContainer>
  );
}

export interface Props {
  uuid: TUuid;
  symbol: TSymbol;
  name?: string;
  onClick?(): void;
}

export default AssetDropdownItem;
