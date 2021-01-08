import React from 'react';

import styled from 'styled-components';

import { Box, Icon, Text, TIcon } from '@components';
import { useAnalytics } from '@hooks';
import { SPACING } from '@theme';
import { translateRaw } from '@translations';
import { TURL } from '@types';
import { openLink } from '@utils';

import { MYCLinks, productsLinks, socialLinks, supportUsTray } from '../constants';
import { SupportUsTray } from './SupportUsTray';

const SBox = styled(Box)<{ animation: 'small' | 'big' }>`
  &:hover {
    transform: scale(${(p) => (p.animation === 'small' ? 1.02 : 1.1)});
  }
  transition: all 300ms ease;
`;

const SocialLink = ({ icon, onClick }: { icon: string; onClick(): void }) => (
  <SBox
    animation="big"
    variant="rowCenter"
    backgroundColor="WHITE"
    width="40px"
    height="40px"
    boxShadow="0px 3px 6px rgba(0, 0, 0, 0.07);"
    onClick={onClick}
    style={{ cursor: 'pointer' }}
  >
    <Icon type={icon as TIcon} width="24px" />
  </SBox>
);

const MYCLink = ({ title, icon, onClick }: { title: string; icon: string; onClick(): void }) => (
  <SBox
    animation="small"
    variant="rowAlign"
    width="100%"
    height="56px"
    my={SPACING.XS}
    backgroundColor="WHITE"
    boxShadow="0px 3px 6px rgba(0, 0, 0, 0.07);"
    style={{ cursor: 'pointer' }}
    onClick={onClick}
  >
    <Icon type={icon as TIcon} width="24px" style={{ margin: `0 ${SPACING.SM}` }} />
    <Text fontSize="14px" fontWeight="400" mb={0}>
      {title}
    </Text>
  </SBox>
);

const ProductLink = ({ title, onClick }: { title: string; link: string; onClick(): void }) => (
  <Box
    variant="rowAlign"
    width="48%"
    my={SPACING.SM}
    style={{ cursor: 'pointer' }}
    onClick={onClick}
  >
    <Icon type="nav-new-tab" width="24px" />
    <Text ml={SPACING.SM} mb={0} color="BLUE_SKY" fontSize="14px">
      {title}
    </Text>
  </Box>
);

export const LinkSet = ({ isMobile }: { isMobile: boolean }) => {
  const { track } = useAnalytics();

  const handleClick = (item: { link: string }) => {
    openLink(item.link as TURL);
    track({ name: 'Link clicked', params: { url: item.link } });
  };

  return (
    <Box px={SPACING.SM} py={SPACING.BASE}>
      <Text
        fontSize="14px"
        textTransform="uppercase"
        color="GREYISH_BROWN"
        fontWeight="700"
        mb={SPACING.BASE}
      >
        {translateRaw('NAVIGATION_GET_SOCIAL')}
      </Text>
      <Box variant="rowAlign" justifyContent="space-between" mb={SPACING.MD}>
        {socialLinks.map((item, i) => (
          <SocialLink key={i} {...item} onClick={() => handleClick(item)} />
        ))}
      </Box>
      <Text
        fontSize="14px"
        color="GREYISH_BROWN"
        textTransform="uppercase"
        fontWeight="700"
        mb={SPACING.BASE}
      >
        {translateRaw('NAVIGATION_MORE_MYC')}
      </Text>
      <Box width="100%" mb={SPACING.MD}>
        {MYCLinks.map((item, i) => (
          <MYCLink key={i} {...item} onClick={() => handleClick(item)} />
        ))}
      </Box>
      {isMobile && <SupportUsTray items={supportUsTray.items} />}
      <Text
        fontSize="14px"
        color="GREYISH_BROWN"
        textTransform="uppercase"
        fontWeight="700"
        mb={SPACING.SM}
      >
        {translateRaw('NAVIGATION_OTHER_PRODUCTS')}
      </Text>
      <Box variant="rowAlign" flexWrap="wrap" justifyContent="space-between">
        {productsLinks.map((item, i) => (
          <ProductLink key={i} {...item} onClick={() => handleClick(item)} />
        ))}
      </Box>
    </Box>
  );
};
