import React from 'react';

import styled from 'styled-components';

import { Box, Icon, Text } from '@components';
import { useAnalytics } from '@hooks';
import { ANALYTICS_CATEGORIES } from '@services';
import { SPACING } from '@theme';
import { IExternalLink } from '@types';
import { openLink } from '@utils';

const SBox = styled(Box)`
  &:hover {
    transform: scale(1.05);
    transition: all 300ms;
  }
  transition: all 300ms;
`;

export const ExternalLink = ({ item }: { item: IExternalLink }) => {
  const trackLinkClicked = useAnalytics({
    category: ANALYTICS_CATEGORIES.FOOTER
  });

  const handleClick = () => {
    openLink(item.link);
    trackLinkClicked({ actionName: `${item.analyticsEvent} link clicked` });
  };

  return (
    <SBox variant="rowAlign" onClick={handleClick} my={SPACING.SM}>
      <Icon type={item.icon} width="20px" />
      <Text ml="15px" color="BLUE_DARK_SLATE" mb={0}>
        {item.title}
      </Text>
    </SBox>
  );
};
