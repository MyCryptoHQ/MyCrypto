import React from 'react';

import { Box, Icon, Text, TIcon } from '@components';
import { SPACING } from '@theme';
import { translateRaw } from '@translations';

export const TopItem = ({
  left = false,
  icon,
  title,
  current,
  onClick
}: {
  left?: boolean;
  icon: TIcon;
  title: string;
  current?: boolean;
  onClick?(): void;
}) => (
  <Box
    variant="columnCenter"
    mr={{ _: left ? 'auto' : SPACING.MD, sm: SPACING.MD }}
    onClick={onClick && onClick}
    style={{
      cursor: 'pointer',
      transform: current ? 'scale(1.1)' : 'unset',
      transition: 'all 300ms ease'
    }}
  >
    <Icon type={icon} height="24px" />
    <Text
      mt={SPACING.XS}
      textTransform="uppercase"
      fontSize={5}
      fontWeight={current ? 'bold' : 700}
      mb={0}
    >
      {translateRaw(title)}
    </Text>
  </Box>
);
