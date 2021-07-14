import styled, { keyframes } from 'styled-components';
import { space, SpaceProps } from 'styled-system';

const rotate = keyframes`
   100% { transform: rotate(360deg)}
`;

const Svg = styled.svg<{ $size: number } & SpaceProps>`
  ${space}
  animation: ${rotate} 0.8s linear infinite;

  & > circle {
    ${(p) => p.color && `stroke: ${p.color};`}
    stroke-linecap: round;
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
  }

  ${(p) => p.$size && `width: ${p.$size}em;`}
  ${(p) => p.$size && `height: ${p.$size}em;`}
`;

const COLORS = {
  light: '#fff',
  default: '#7c9ec3',
  brand: '#a086f7'
};

export const Spinner = ({
  size = 1,
  color = 'default',
  ...props
}: {
  size?: number;
  color?: keyof typeof COLORS;
} & SpaceProps) => {
  return (
    <Svg
      data-testid="spinner"
      viewBox="0 0 50 50"
      aria-busy="true"
      color={COLORS[color]}
      $size={size}
      {...props}
    >
      <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
    </Svg>
  );
};

export default Spinner;
