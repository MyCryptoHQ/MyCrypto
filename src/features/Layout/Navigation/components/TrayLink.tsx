import React from 'react';

import { Box, Icon, LinkApp, Text } from '@components';
import { useAnalytics } from '@services/Analytics';
import { SPACING } from '@theme';
import { IExternalLink } from '@types';

export const TrayLink = ({ item }: { item: IExternalLink }) => {
  const { track } = useAnalytics();

  const handleClick = () => {
    track({ name: 'Link clicked', params: { url: item.link } });
  };

  return (
    <LinkApp href={item.link} isExternal={true} onClick={handleClick} $animate={true}>
      <Box variant="rowAlign" my={SPACING.SM}>
        <Icon type={item.icon} width={{ _: '20px', sm: '2vh', xxl: '20px' }} />
        <Text
          ml={{ _: '15px', sm: '1.5vh', xxl: '15px' }}
          color="BLUE_DARK_SLATE"
          mb={0}
          fontSize={{ _: '16px', sm: '1.6vh', xxl: '16px' }}
        >
          {item.title}
        </Text>
      </Box>
    </LinkApp>
  );
};