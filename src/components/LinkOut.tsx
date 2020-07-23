import React from 'react';
import styled from 'styled-components';
import { Typography } from '@components';
import { COLORS, FONT_SIZE } from '@theme';

import LinkOutIcon from '@assets/images/link-out.svg';

const { BLUE_BRIGHT } = COLORS;

interface LinkOutWrapperProps {
  inline: boolean;
  underline: boolean;
}

const LinkOutWrapper = styled.a<LinkOutWrapperProps>`
  display: ${({ inline }) => (inline ? 'inline-flex' : 'flex')};
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  > :not(img) {
    ${({ underline }) => (underline ? 'text-decoration: underline' : '')};
  }
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
  showIcon?: boolean;
  inline?: boolean;
  fontSize?: string;
  fontColor?: string;
  underline?: boolean;
  truncate?(text: string): string;
}

const LinkOut = ({
  text,
  link,
  truncate,
  showIcon = true,
  inline = false,
  fontSize = FONT_SIZE.BASE,
  fontColor = COLORS.GREYISH_BROWN,
  underline = false
}: Props) => {
  const content = text && (truncate ? truncate(text) : text);
  return (
    <LinkOutWrapper
      href={link}
      target="_blank"
      rel="noreferrer"
      inline={inline}
      underline={underline}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    >
      <Typography fontSize={fontSize} style={{ color: fontColor }}>
        {content}
      </Typography>
      {showIcon && <OutIcon useMargin={!!content} src={LinkOutIcon} />}
    </LinkOutWrapper>
  );
};

export default LinkOut;
