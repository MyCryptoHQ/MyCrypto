import React, { ReactNode } from 'react';

import styled from 'styled-components';
import { Avatar, Identicon, Tooltip, scale } from '@mycrypto/ui';
import Typography from './Typography';
import EthAddress from './EthAddress';

const Flex = styled.div`
  align-items: center;
  display: flex;
`;

const Content = styled.div`
  padding-left: 1em;
`;

const Title = styled(Typography)`
  display: inline;
  font-size: ${scale(0.5)};
`;

Title.defaultProps = { as: 'div' };

const MissingTitle = styled(Title)`
  color: ${props => props.theme.textLight};
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
  }
`;

interface TooltipType {
  image?: string;
  content: ReactNode | string;
}

interface Props {
  address: string;
  className?: string;
  title?: string;
  isCopyable?: boolean;
  tooltip?: TooltipType;
  onSubmit?(title?: string): void;
  truncate?(text: string): string;
}

export default function Account({
  title,
  address,
  isCopyable = true,
  truncate,
  tooltip,
  className
}: Props) {
  const TitleComponent = title ? Title : MissingTitle;
  const ImageComponent = () =>
    tooltip && tooltip.image ? <SAvatar src={tooltip.image} /> : <SIdenticon address={address} />;

  const renderAddressContent = () => (
    <Flex className={className}>
      <ImageComponent />
      <Content>
        <>
          <TitleComponent>{title}</TitleComponent>
        </>
        <div>
          <Address address={address} truncate={truncate} isCopyable={isCopyable} />
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
