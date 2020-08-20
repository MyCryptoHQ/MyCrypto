import React, { ReactNode } from 'react';
import { toChecksumAddress } from 'ethereumjs-util';
import styled from 'styled-components';
import { Avatar, Identicon, scale } from '@mycrypto/ui';

import { translateRaw } from '@translations';
import { FONT_SIZE, BREAK_POINTS } from '@theme';

import Typography from './Typography';
import EthAddress from './EthAddress';
import Tooltip from './Tooltip';

const Flex = styled.div`
  align-items: center;
  display: flex;
`;

const Content = styled.div`
  padding-left: 1em;
`;

const Title = styled(Typography)`
  display: inline;
  font-size: ${FONT_SIZE.BASE};
  word-break: break-word;
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    font-weight: bold;
  }
`;

Title.defaultProps = { as: 'div' };

const MissingTitle = styled(Title)`
  color: ${(props) => props.theme.textLight};
  font-style: italic;
`;

MissingTitle.defaultProps = { children: 'No Label' };

const Address = styled(EthAddress)`
  font-size: ${scale(0.25)};
`;

const SAvatar = styled(Avatar)`
  &&& img {
    height: 45px;
    width: 44px;
  }
`;

const SIdenticon = styled(Identicon)`
  &&& img {
    height: 45px;
    width: 44px;
    max-width: none;
  }
`;

interface TooltipType {
  image?: string;
  content: ReactNode | string;
}

interface Props {
  address: string;
  title?: JSX.Element | string;
  className?: string;
  isCopyable?: boolean;
  tooltip?: TooltipType;
  truncate: boolean;
  onSubmit?(title?: string): void;
}

export default function Account({
  title = translateRaw('NO_LABEL'),
  address,
  isCopyable = true,
  truncate,
  tooltip,
  className
}: Props) {
  const TitleComponent = title ? Title : MissingTitle;
  const ImageComponent = () =>
    tooltip && tooltip.image ? <SAvatar src={tooltip.image} /> : <SIdenticon address={address} />;

  const TitleItem = typeof title === 'string' ? <TitleComponent>{title}</TitleComponent> : title;
  const renderAddressContent = () => (
    <Flex className={className}>
      <ImageComponent />
      <Content>
        <>{TitleItem}</>
        <div>
          <Address
            address={toChecksumAddress(address)}
            truncate={truncate}
            isCopyable={isCopyable}
          />
        </div>
      </Content>
    </Flex>
  );

  return tooltip ? (
    <Tooltip tooltip={<Typography as="div">{tooltip.content}</Typography>}>
      {renderAddressContent()}
    </Tooltip>
  ) : (
    renderAddressContent()
  );
}
