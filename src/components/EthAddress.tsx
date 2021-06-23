import { MouseEvent } from 'react';

import { Copyable } from '@mycrypto/ui';
import { toChecksumAddress } from 'ethereumjs-util';
import styled from 'styled-components';

import { COLORS, monospace } from '@theme';
import { truncate as truncateFunc } from '@utils';

// Override styles of @mycrypto/ui in order to vertically align text and icon.
// Ensure the icon uses the discrete color.
interface SProps {
  inline?: boolean;
}
const Overrides = styled.div`
  display: ${(props: SProps) => (props.inline ? 'inline-block' : 'block')};

  * {
    font-family: ${monospace};
  }

  & button {
    vertical-align: ${(props: SProps) => (props.inline ? 'inherit' : 'middle')};
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
    width: auto;
  }
  & button svg {
    margin-left: -0.5ch;
    height: 0.8em;
    color: ${COLORS.BLUE_GREY};
  }
`;

interface Props extends SProps {
  address: string;
  truncate: boolean;
  isCopyable?: boolean;
  disableTooltip?: boolean;
}

function EthAddress({
  address,
  isCopyable = true,
  truncate = false,
  inline = false,
  disableTooltip = false
}: Props) {
  return (
    <Overrides inline={inline} onClick={(e: MouseEvent) => e.stopPropagation()}>
      <Copyable
        text={toChecksumAddress(address)}
        isCopyable={isCopyable}
        truncate={truncate ? truncateFunc : undefined}
        disableTooltip={disableTooltip}
      />
    </Overrides>
  );
}

export default EthAddress;
