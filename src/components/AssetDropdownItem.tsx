import React from 'react';
import styled from 'styled-components';

import { TSymbol, TUuid } from '@types';
import { AssetIcon, Typography } from '@components';

const SContainer = styled.div<StyleProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 14px 15px 14px 15px;
  ${({ paddingLeft }) => paddingLeft && `padding-left: ${paddingLeft};`}
`;

function AssetDropdownItem({ uuid, symbol, name, onClick, paddingLeft }: Props) {
  return (
    <SContainer
      className="asset-dropdown-item"
      paddingLeft={paddingLeft}
      {...(onClick ? { onPointerDown: onClick } : null)}
    >
      <AssetIcon uuid={uuid} size={'1.5rem'} />
      <Typography bold={true} value={symbol} style={{ marginLeft: '10px' }} />
      {name && <span>&nbsp; - &nbsp;</span>}
      <Typography value={name} />
    </SContainer>
  );
}

interface StyleProps {
  paddingLeft?: string;
}

export interface Props extends StyleProps {
  uuid: TUuid;
  symbol: TSymbol;
  name?: string;
  onClick?(): void;
}

export default AssetDropdownItem;
