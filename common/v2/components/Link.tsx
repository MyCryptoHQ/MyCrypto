import styled from 'styled-components';
import { COLORS } from '@theme';

const getColor = (type: LinkType) => {
  switch (type) {
    case 'white-black':
      return COLORS.WHITE;
    case 'default':
    default:
      return COLORS.BLUE_BRIGHT;
  }
};

const getHoverColor = (type: LinkType) => {
  switch (type) {
    case 'white-black':
      return COLORS.BLACK;
    case 'default':
    default:
      return COLORS.BLACK;
  }
};

type LinkType = 'default' | 'white-black' | undefined;

interface LinkProps {
  fullWidth?: boolean;
  type?: LinkType;
  underline?: boolean;
}

const StyledLink = styled.a<LinkProps>`
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
  ${({ underline }) => underline && 'text-decoration: underline;'}
  color: ${({ type }) => getColor(type)};
  &:hover {
    color: ${({ type }) => getHoverColor(type)};
  }
`;

export default StyledLink;
