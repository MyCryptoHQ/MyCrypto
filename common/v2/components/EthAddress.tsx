import React from 'react';
import styled from 'styled-components';
import { Copyable } from '@mycrypto/ui';

import { COLORS } from 'v2/theme';

// Override styles of @mycrypto/ui in order to vertically align text and icon.
// Ensure the icon uses the discrete color.
const Overrides = styled.div`
  & button {
    vertical-align: middle;
    font-size: 1em;
    line-height: 24px;
  }
  & button span {
    display: inline-flex;
    height: 100%;
    align-items: center;
    vertical-align: middle;
    margin-top: -0.1ch;
    line-height: 24px;
  }
  & button svg {
    height: 0.8em;
    color: ${COLORS.CLOUDY_BLUE};
  }
`;
interface Props {
  address: string;
  isCopyable?: boolean;
  truncate: any;
}

function EthAddress({ address, isCopyable = true, truncate }: Props) {
  return (
    <Overrides>
      <Copyable text={address.toLowerCase()} isCopyable={isCopyable} truncate={truncate} />
    </Overrides>
  );
}

export default EthAddress;
