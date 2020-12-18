import React from 'react';

import { Box, Icon, Text, TIcon } from '@components';
import { COLORS, SPACING } from '@theme';
import { translateRaw } from '@translations';

export const TopItem = ({
  left = false,
  icon,
  title,
  current,
  onClick,
  color
}: {
  left?: boolean;
  icon: TIcon;
  title: string;
  current?: boolean;
  onClick?(): void;
  color: string;
}) => (
  <Box
    zIndex={999}
    variant="columnCenter"
    mr={{ _: left ? 'auto' : SPACING.MD, sm: SPACING.MD }}
    onClick={onClick && onClick}
    style={{
      cursor: 'pointer',
      transform: current ? 'scale(1.1)' : 'unset',
      transition: 'all 300ms ease'
    }}
  >
    <Icon type={icon} height="24px" color={current ? COLORS.BLUE_BRIGHT : color} />
    <Text
      mt={SPACING.XS}
      color={current ? COLORS.BLUE_BRIGHT : color}
      textTransform="uppercase"
      fontSize={5}
      fontWeight={current ? 'bold' : 700}
      mb={0}
    >
      {translateRaw(title)}
    </Text>
  </Box>
);
