import styled from 'styled-components';

import { Box, Icon, LinkApp, Text } from '@components';
import { COLORS } from '@theme';
import { IRouteLink } from '@types';

const SLink = styled(LinkApp)`
  &:hover {
    background-color: ${COLORS.BLUE_DARK_SLATE};
    p {
      color: ${COLORS.WHITE};
      transition: all 300ms;
    }
    path {
      fill: ${COLORS.WHITE};
      transition: all 300ms;
    }
    opacity: 1;
    transition: all 300ms;
  }
  transition: all 300ms;
`;

export const TrayItem = ({ item, current }: { item: IRouteLink; current: boolean }) => (
  <SLink style={{ width: '100%', padding: '10px 15px', margin: 0 }} href={item.to} variant="barren">
    <Box variant="rowAlign">
      <Icon
        color={COLORS.BLUE_DARK_SLATE}
        type={item.icon}
        width={{ _: '24px', sm: '2.4vh', xxl: '24px' }}
      />
      <Text
        ml={{ _: '15px', sm: '1.5vh', xxl: '15px' }}
        color="BLUE_DARK_SLATE"
        fontWeight={current ? 'bold' : 'normal'}
        mb={0}
        fontSize={{ _: '16px', sm: '1.6vh', xxl: '16px' }}
      >
        {item.title}
      </Text>
    </Box>
  </SLink>
);
