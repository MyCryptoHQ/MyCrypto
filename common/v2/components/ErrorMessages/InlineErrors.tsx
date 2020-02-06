import React from 'react';
import styled from 'styled-components';
import { COLORS } from 'v2/theme';
import { InlineErrorType } from 'v2/types/inlineErrors';
import Typography from '../Typography';
import announcementSVG from 'assets/images/icn-announcement.svg';
import errorSVG from 'assets/images/icn-toast-error.svg';

interface Props {
  type: InlineErrorType;
  value: any;
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
`;

const errorConfig = (type: InlineErrorType): Config => {
  switch (type) {
    default:
    case InlineErrorType.ERROR:
      return {
        color: COLORS.PASTEL_RED,
        icon: errorSVG
      };
    case InlineErrorType.INFO:
      return {
        color: COLORS.WHITE,
        icon: announcementSVG
      };
  }
};

export default function InlineErrorMsg({ type, value, children }: Props) {
  const config = errorConfig(type);
  return (
    <Wrapper>
      <Icon src={config.icon} color={config.color} alt={type} />
      <STypography value={value || children} color={config.color} />
    </Wrapper>
  );
}
