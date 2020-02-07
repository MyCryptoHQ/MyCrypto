import React from 'react';
import styled from 'styled-components';
import { COLORS } from 'v2/theme';
import { InlineMessageType } from 'v2/types/inlineMessages';
import Typography from '../Typography';
import infoSVG from 'assets/images/icn-info.svg';
import warningSVG from 'assets/images/icn-warning.svg';

interface Props {
  type?: InlineMessageType;
  value?: any;
  children?: any;
  className?: string;
}

interface Config {
  color: string;
  icon: string;
}

export const Wrapper = styled.div`
  font-size: 16px;
  width: 100%;
  text-align: justify;
  white-space: pre-line;
`;

interface BannerTypographyProps {
  color: string;
}

const STypography = styled(Typography)<BannerTypographyProps>`
  color: ${props => props.color};

  a {
    color: ${props => props.color};
    text-decoration: underline;
    font-weight: normal;
  }

  a:hover {
    color: ${props => props.color};
    font-weight: bold;
  }
`;

const Icon = styled.img`
  color: ${props => props.color};
  max-width: 24px;
  margin-right: 6px;
`;

const messageConfig = (type: InlineMessageType): Config => {
  switch (type) {
    default:
    case InlineMessageType.ERROR:
      return {
        color: COLORS.PASTEL_RED,
        icon: warningSVG
      };
    case InlineMessageType.INFO:
      return {
        color: COLORS.WHITE,
        icon: infoSVG
      };
  }
};

export default function InlineMessage({
  type = InlineMessageType.ERROR,
  value,
  children,
  className
}: Props) {
  const config = messageConfig(type);
  return (
    <Wrapper className={className}>
      <Icon src={config.icon} color={config.color} alt={type} />
      <STypography value={value || children} color={config.color} />
    </Wrapper>
  );
}
