import React from 'react';
import styled from 'styled-components';
import { Typography } from 'v2/components';
import { COLORS } from 'v2/theme';

import LinkOutIcon from 'assets/images/link-out.svg';

const { BLUE_BRIGHT } = COLORS;

const LinkOutWrapper = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  p {
    margin: 0;
  }
`;

const OutIcon = styled.img<{ useMargin: boolean }>`
  color: ${BLUE_BRIGHT};
  width: 18px;
  height: 18px;
  ${({ useMargin }) => useMargin && 'margin-left: 10px;'};
  max-width: none;
`;

interface Props {
  text?: string;
  link: string;
  truncate?(text: string): string;
}

const LinkOut = ({ text, link, truncate }: Props) => {
  const content = truncate && text ? truncate(text) : text;
  return (
    <LinkOutWrapper href={link} target="_blank" rel="noreferrer">
      <Typography fontSize={'16px'}>{content}</Typography>
      <OutIcon useMargin={!!content} src={LinkOutIcon} />
    </LinkOutWrapper>
  );
};

export default LinkOut;
