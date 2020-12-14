import React from 'react';

import { Box, Icon, Text } from '@components';
import { useAnalytics } from '@hooks';
import { ANALYTICS_CATEGORIES } from '@services';
import { IExternalLink } from '@types';
import { openLink } from '@utils';

export const ExternalLink = ({ item }: { item: IExternalLink }) => {
  const trackLinkClicked = useAnalytics({
    category: ANALYTICS_CATEGORIES.FOOTER
  });

  const handleClick = () => {
    openLink(item.link);
    trackLinkClicked({ actionName: `${item.analyticsEvent} link clicked` });
  };

  return (
    <Box variant="rowAlign" onClick={handleClick} my="10px">
      <Icon type={item.icon} width="20px" />
      <Text ml="15px" color="BLUE_DARK_SLATE" fontSize="12px" mb={0}>
        {item.title}
      </Text>
    </Box>
  );
};
