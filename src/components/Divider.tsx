import { ComponentProps } from 'react';

import Box from './Box';

const Divider = ({
  height = '1px',
  width = '100%',
  color = 'discrete',
  ...props
}: ComponentProps<typeof Box>) => {
  return <Box backgroundColor={color} height={height} width={width} {...props} />;
};

export default Divider;
