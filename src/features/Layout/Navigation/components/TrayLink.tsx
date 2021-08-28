import styled from 'styled-components';

import { Box, Icon, LinkApp, Text } from '@components';
import { useAnalytics } from '@services/Analytics';
import { SPACING } from '@theme';
import { IExternalLink } from '@types';

const SBox = styled(Box)`
  &:hover {
    transform: scale(1.05);
    transition: all 300ms;
  }
  transition: all 300ms;
`;

export const TrayLink = ({ item }: { item: IExternalLink }) => {
  const { trackLink } = useAnalytics();

  const handleClick = () => {
    trackLink({ url: item.link });
  };

  return (
    <LinkApp href={item.link} isExternal={true} onClick={handleClick}>
      <SBox variant="rowAlign" my={SPACING.SM}>
        <Icon type={item.icon} width={{ _: '20px', sm: '2vh', xxl: '20px' }} />
        <Text
          ml={{ _: '15px', sm: '1.5vh', xxl: '15px' }}
          color="BLUE_DARK_SLATE"
          mb={0}
          fontSize={{ _: '16px', sm: '1.6vh', xxl: '16px' }}
        >
          {item.title}
        </Text>
      </SBox>
    </LinkApp>
  );
};
