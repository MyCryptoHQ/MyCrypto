import styled from 'styled-components';

import { Box, Icon, LinkApp, Text, TIcon } from '@components';
import { useAnalytics } from '@services/Analytics';
import { SPACING } from '@theme';
import { translateRaw } from '@translations';
import { COMMIT_HASH } from '@utils';

import { MYCLinks, productsLinks, socialLinks, supportUsTray } from '../constants';
import { SupportUsTray } from './SupportUsTray';

const SBox = styled(Box)<{ animation: 'small' | 'big' }>`
  &:hover {
    transform: scale(${(p) => (p.animation === 'small' ? 1.02 : 1.1)});
  }
  color: inherit;
  transition: all 300ms ease;
`;

const SocialLink = ({ icon, link, onClick }: { icon: string; link: string; onClick(): void }) => (
  <LinkApp href={link} isExternal={true} onClick={onClick}>
    <SBox
      animation="big"
      variant="rowCenter"
      backgroundColor="WHITE"
      width="40px"
      height="40px"
      boxShadow="0px 3px 6px rgba(0, 0, 0, 0.07);"
    >
      <Icon type={icon as TIcon} width="24px" />
    </SBox>
  </LinkApp>
);

const MYCLink = ({
  title,
  icon,
  link,
  onClick
}: {
  title: string;
  icon: string;
  link: string;
  onClick(): void;
}) => (
  <LinkApp variant="barren" href={link} isExternal={true} onClick={onClick}>
    <SBox
      animation="small"
      variant="rowAlign"
      width="100%"
      height="56px"
      my={SPACING.XS}
      backgroundColor="WHITE"
      boxShadow="0px 3px 6px rgba(0, 0, 0, 0.07);"
    >
      <Icon type={icon as TIcon} width="24px" style={{ margin: `0 ${SPACING.SM}` }} />
      <Text fontSize="14px" fontWeight="400" mb={0}>
        {title}
      </Text>
    </SBox>
  </LinkApp>
);

const ProductLink = ({
  title,
  link,
  onClick
}: {
  title: string;
  link: string;
  onClick(): void;
}) => (
  <LinkApp width="48%" href={link} isExternal={true} onClick={onClick} variant="opacityLink">
    <Box variant="rowAlign" my={SPACING.SM}>
      <Icon type="nav-new-tab" width="24px" />
      <Text ml={SPACING.SM} mb={0} fontSize="14px">
        {title}
      </Text>
    </Box>
  </LinkApp>
);

export const LinkSet = ({ isMobile }: { isMobile: boolean }) => {
  const { trackLink } = useAnalytics();

  const handleClick = (item: { link: string }) => {
    trackLink({ url: item.link });
  };

  return (
    <Box px={SPACING.SM} pb={SPACING.BASE} pt={SPACING.SM}>
      {COMMIT_HASH && (
        <Box variant="rowAlign" justifyContent="flex-end">
          {'v.'}
          <LinkApp
            href={`https://github.com/MyCryptoHQ/MyCrypto/commit/${COMMIT_HASH}`}
            isExternal={true}
          >
            {COMMIT_HASH.substr(0, 7)}
          </LinkApp>
        </Box>
      )}
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
