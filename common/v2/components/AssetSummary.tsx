import React from 'react';
import styled from 'styled-components';

import { TSymbol } from 'v2/types';
import { AssetIcon, Typography } from 'v2/components';

const SContainer = styled('div')`
  display: flex;
  flex-direction: row;
  padding: 14px 15px 14px 15px;

  &:hover {
    background-color: ${(p: { selectable: boolean }) =>
      p.selectable ? 'var(--color-gray-lighter)' : 'inherit'};
  }
`;

function AssetSummary({ symbol, name, onClick, selectable = false }: Props) {
  return (
    <SContainer {...(onClick ? { onPointerDown: onClick } : null)} selectable={selectable}>
      <AssetIcon symbol={symbol} size={'1.5rem'} />
      <Typography bold={true} value={symbol} style={{ marginLeft: '6px' }} />
      {name && <span>&nbsp; - &nbsp;</span>}
      <Typography value={name} />
    </SContainer>
  );
}

interface Props {
  symbol: TSymbol;
  name?: string;
  selectable?: boolean;
  onClick?(): void;
}

export default AssetSummary;
