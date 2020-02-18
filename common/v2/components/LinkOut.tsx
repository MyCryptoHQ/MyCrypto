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

const OutIcon = styled.img`
  color: ${BLUE_BRIGHT};
  width: 18px;
  height: 18px;
  margin-left: 10px;
`;

interface Props {
  text: string;
  link: string;
  truncate?(text: string): string;
}

const LinkOut = ({ text, link, truncate }: Props) => {
  const content = truncate ? truncate(text) : text;
  return (
    <LinkOutWrapper href={link} target="_blank" rel="noreferrer">
      <Typography fontSize={'16px'}>{content}</Typography>
      <OutIcon src={LinkOutIcon} />
    </LinkOutWrapper>
  );
};

export default LinkOut;
