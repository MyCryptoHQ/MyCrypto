import React from 'react';
import styled from 'styled-components';

interface Props {
  height?: string;
  color?: string;
  padding?: string;
}

const SDivider = styled('div')`
  height: ${(p: Props) => (p.height ? p.height : '1px')};
  background-color: ${(p: Props) => (p.color ? p.color : 'var(--color-gray-lighter)')};
  width: 100%;
  background-clip: content-box;
  padding-left: ${(p: Props) => (p.padding ? p.padding : 0)};
  padding-right: ${(p: Props) => (p.padding ? p.padding : 0)};
`;

function Divider({ color, height, padding, ...props }: Props) {
  return <SDivider padding={padding} color={color} height={height} {...props} />;
}

export default Divider;
